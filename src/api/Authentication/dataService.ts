import bcryptjs from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { Constants } from '../../_shared/constants';
import { getBadRequestError, getSignedAuthToken } from '../../_shared/services';
import { getUserByIdQuery } from '../../_shared/services/dataService';
import { runInsertQuery, runInTransaction, runQuery } from '../../_shared/services/dBService';
import { generateCodeFromNumber } from '../../_shared/services/utilities';
import {
	addUserProfileQuery,
	countMatchingIdAndCodeQuery,
	getUserByCredentialsQuery,
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
			verificationCode,
			roles: [Constants.privileges.USER]
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
	if (!Boolean(count)) throw getBadRequestError('invalid verification code');

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
