import { getBadRequestError } from 'base/errors/node/badRequestError';
import { getSignedAuthToken } from 'base/server/validation';
import { generateCodeFromNumber } from 'base/utils/node/codeGenerator';
import bcryptjs from 'bcryptjs';
import { runQuery } from 'core/database/queryRunners';
import { decryptData, encryptData } from 'core/encryption/node/encryption';
import { getUserByCredentialsQuery, getUserByIdQuery } from 'core/queries/userQueries';
import { updateUserVerificationCodeQuery } from 'feature/authentication/queries/updateUserVerificationCodeQuery';

export const verifyUserLoginCredentials = async (data: {
	email?: string;
	phoneNumber?: string;
	username?: string;
	password: string;
}) => {
	const { phoneNumber, password, email, username } = data;
	if (!phoneNumber && !email && !username) {
		throw getBadRequestError('phoneNumber, email or username is required');
	}
	if (!password) throw getBadRequestError('password is required');

	const user = await runQuery(getUserByCredentialsQuery, [data]);
	if (!user) throw getBadRequestError('Invalid user account');

	if (!bcryptjs.compareSync(password, user.password)) {
		throw getBadRequestError('Invalid user account');
	}

	const { password: hashedPassword, verificationCode, ...other } = user;

	// create user token
	const token = getSignedAuthToken({ id: user.id, roles: user.roles });
	const profile = Object.assign({}, other, { token });

	return profile;
};

/**
 * the service function validates the user's credentials in the
 * database to check if the user exists
 * if the user does exists, a new verification code is generated
 * and stored in the database
 */
export const getUserAccountWithCredentials = async (args: {
	email?: string;
	phoneNumber?: string;
	username?: string;
}) => {
	const user = await runQuery(getUserByCredentialsQuery, [args]);
	if (!user) throw getBadRequestError('Invalid user account');

	// generate new verification code
	const verificationCode = generateCodeFromNumber();
	const encryptedVerificationCode = encryptData({
		text: verificationCode
	});

	// update user profile
	await runQuery(updateUserVerificationCodeQuery, [
		{ id: user.id, verificationCode: encryptedVerificationCode }
	]);

	const { password, ...other } = user;

	const token = getSignedAuthToken({ id: user.id, roles: user.roles });
	const profile = Object.assign({}, other, { token, verificationCode });

	return profile;
};

export const checkUserVerificationCode = async (data: { id: string; verificationCode: string }) => {
	const { id, verificationCode } = data;

	if (!id || !verificationCode) {
		throw getBadRequestError('user id and verification code are required');
	}

	const user = await runQuery(getUserByIdQuery, [id]);
	if (!user) throw getBadRequestError('Invalid user account');

	const decryptedVerificationCode = decryptData({ encryptedText: user.verificationCode });
	if (verificationCode !== decryptedVerificationCode) {
		throw getBadRequestError('Invalid verification code');
	}

	return true;
};
