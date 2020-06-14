import bcryptjs from 'bcryptjs';
import {
	countMatchingIdAndCodeQuery,
	updateUserVerificationCodeQuery
} from 'feature/authentication/node/queries';
import { getBadRequestError } from 'shared/common/errors';
import { generateCodeFromNumber } from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import { runInsertQuery, runInTransaction, runQuery } from 'shared/node/database';
import {
	addUserProfileQuery,
	getUserByCredentialsQuery,
	getUserByIdQuery
} from 'shared/node/queries';
import { getSignedAuthToken } from 'shared/node/validation';
import { IAddUserProfile } from 'shared/types';
import { EntityManager } from 'typeorm';

export const addUserTransaction = (email = '', phoneNumber = '') => {
	return async (manager: EntityManager) => {
		// generate a verification code for the user
		const verificationCode = generateCodeFromNumber();

		// construct a default user info
		const profile: IAddUserProfile = {
			username: '',
			password: '',
			dob: new Date(),
			image: '',
			biography: '',
			email: email || '',
			phoneNumber: phoneNumber || '',
			isEmailVerified: false,
			verificationCode,
			roles: [Constants.privileges.USER],
			name: ''
		};

		const [user] = await runInsertQuery(addUserProfileQuery, [profile], manager);

		return runQuery(getUserByIdQuery, [user.id], manager);
	};
};

export const createUserProfileWithDefaultValues = async (data: {
	email?: string;
	phoneNumber?: string;
}) => {
	const user = await runQuery(getUserByCredentialsQuery, [data]);
	if (user) throw getBadRequestError('User already exists');

	// save user profile into the database
	const userProfile = await runInTransaction(addUserTransaction(data.email, data.phoneNumber));

	// add token to user profile
	const token = getSignedAuthToken({ id: userProfile!.id, roles: [Constants.privileges.USER] });
	const profile = Object.assign({}, userProfile, { token });

	return profile;
};

export const checkUserVerificationCode = async (data: { id: string; verificationCode: string }) => {
	const { id, verificationCode } = data;

	if (!id || !verificationCode) {
		throw getBadRequestError('user id and verification code are required');
	}

	const count = await runQuery(countMatchingIdAndCodeQuery, [id, verificationCode]);
	if (!count) throw getBadRequestError('invalid verification code');

	return true;
};

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

	const { password: hashedPassword, ...other } = user;

	// create user token
	const token = getSignedAuthToken({ id: user.id, roles: user.roles });
	const profile = Object.assign({}, other, { token });

	return profile;
};

export const getUserProfileById = async (id: string) => {
	const user = await runQuery(getUserByIdQuery, [id]);
	if (!user) throw getBadRequestError('Invalid user account');
	return user;
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

	// update user profile
	await runQuery(updateUserVerificationCodeQuery, [{ id: user.id, verificationCode }]);

	const { password, ...other } = user;

	const token = getSignedAuthToken({ id: user.id, roles: user.roles });
	const profile = Object.assign({}, other, { token, verificationCode });

	return profile;
};
