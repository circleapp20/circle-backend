import { EntityManager } from 'typeorm';
import { getBadRequestError } from '../../_shared/services';
import { runInsertQuery, runInTransaction, runQuery } from '../../_shared/services/dBService';
import { generateCodeFromNumber } from '../../_shared/services/utilities';
import { addUserProfileQuery, getUserByEmailOrPhoneNumberQuery } from './queryBuilder';
import { IAddUserProfile } from './_helpers/types';

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
			email: email,
			phoneNumber: phoneNumber,
			isEmailVerified: false,
			verificationCode
		};

		return runInsertQuery(addUserProfileQuery, [profile], manager);
	};
};

export const createUserProfileWithDefaultValues = async (data: {
	email?: string;
	phoneNumber?: string;
}) => {
	const user = await runQuery(getUserByEmailOrPhoneNumberQuery, [data]);
	if (user) throw getBadRequestError('User already exists');

	// save user profile into the database
	const userProfile = await runInTransaction(addUserTransaction(data.email, data.phoneNumber));

	return userProfile;
};
