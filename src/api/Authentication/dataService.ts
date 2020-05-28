import { EntityManager } from 'typeorm';
import { getBadRequestError } from '../../_shared/services';
import { getUserByIdQuery } from '../../_shared/services/dataService';
import { runInsertQuery, runInTransaction, runQuery } from '../../_shared/services/dBService';
import { generateCodeFromNumber } from '../../_shared/services/utilities';
import {
	addUserProfileQuery,
	countMatchingIdAndCodeQuery,
	getUserByEmailOrPhoneNumberQuery
} from './queryBuilder';
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
			email: email || '',
			phoneNumber: phoneNumber || '',
			isEmailVerified: false,
			verificationCode
		};

		const [user] = await runInsertQuery(addUserProfileQuery, [profile], manager);

		return runQuery(getUserByIdQuery, [user.id], manager);
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

export const checkUserVerificationCode = async (data: { id: string; verificationCode: string }) => {
	const { id, verificationCode } = data;

	if (!id || !verificationCode) {
		throw getBadRequestError('user id and verification code are required');
	}

	const count = await runQuery(countMatchingIdAndCodeQuery, [id, verificationCode]);
	if (!Boolean(count)) throw getBadRequestError('invalid verification code');

	return true;
};
