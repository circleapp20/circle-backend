import { getBadRequestError } from '../../_shared/services';
import { runInsertQuery, runInTransaction, runQuery } from '../../_shared/services/dBService';
import { generateCodeFromNumber } from '../../_shared/services/utilities';
import { addUserProfileQuery, getUserByEmailOrPhoneNumberQuery } from './queryBuilder';
import { IAddUserProfile } from './_helpers/types';

export const createUserProfileWithDefaultValues = async (data: {
	email?: string;
	phoneNumber?: string;
}) => {
	const user = await runQuery(getUserByEmailOrPhoneNumberQuery, [data]);
	if (user) throw getBadRequestError('User already exists');

	// generate a verification code for the user
	const verificationCode = generateCodeFromNumber();

	// construct a default user info
	const profile: IAddUserProfile = {
		username: '',
		password: '',
		dob: new Date(),
		image: '',
		biography: '',
		email: data.email || '',
		phoneNumber: data.phoneNumber || '',
		isEmailVerified: false,
		verificationCode
	};

	// save user profile into the database
	const userProfile = await runInTransaction((manager) => {
		return runInsertQuery(addUserProfileQuery, [profile], manager);
	});

	return userProfile;
};
