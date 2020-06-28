import { Constants } from 'base/config/node/constants';
import { getBadRequestError } from 'base/errors/node/badRequestError';
import { getSignedAuthToken } from 'base/server/validation';
import { IAddUserProfile } from 'base/types';
import { generateCodeFromNumber } from 'base/utils/node/codeGenerator';
import { runInsertQuery, runInTransaction, runQuery } from 'core/database/queryRunners';
import { decryptData, encryptData } from 'core/encryption/node/encryption';
import {
	addUserProfileQuery,
	getUserByCredentialsQuery,
	getUserByIdQuery
} from 'core/queries/userQueries';
import { EntityManager } from 'typeorm';

export const addUserTransaction = (email = '', phoneNumber = '') => {
	return async (manager: EntityManager) => {
		// generate a verification code for the user
		const verificationCode = generateCodeFromNumber();
		const encryptedVerificationCode = encryptData({ text: verificationCode });

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
			verificationCode: encryptedVerificationCode,
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
	const verificationCode = decryptData({ encryptedText: userProfile!.verificationCode });

	// add token to user profile
	const token = getSignedAuthToken({ id: userProfile!.id, roles: [Constants.privileges.USER] });
	const profile = Object.assign({}, userProfile, { token, verificationCode });

	return profile;
};
