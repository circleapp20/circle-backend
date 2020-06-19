import bcryptjs from 'bcryptjs';
import {
	countMatchingEmailQuery,
	countMatchingUsernameQuery,
	countUsersMatchingSearchQuery,
	updateUserProfileQuery
} from 'feature/users/node/queries';
import { uploadUserProfileImage } from 'feature/users/node/uploads';
import { IUpdateUserProfile } from 'feature/users/types';
import { getBadRequestError } from 'shared/common/errors';
import { Constants } from 'shared/constants';
import { runInTransaction, runQuery } from 'shared/node/database';
import { getUserByIdQuery } from 'shared/node/queries';
import { EntityManager } from 'typeorm';

export const updateUserTransaction = (data: IUpdateUserProfile) => {
	return async (manager: EntityManager) => {
		const password = bcryptjs.hashSync(data.password, 12);
		const profile = Object.assign({}, data, { password });
		await runQuery(updateUserProfileQuery, [profile], manager);
		return runQuery(getUserByIdQuery, [data.id], manager);
	};
};

export const updateUserProfile = async (data: IUpdateUserProfile) => {
	const { username, id, password: rawPassword, image, email, phoneNumber } = data;
	if (!id) throw getBadRequestError('id is required');

	if (!rawPassword) throw getBadRequestError('password is required');

	const count = await runQuery(countUsersMatchingSearchQuery, [{ username, id }]);
	if (count !== 1) throw getBadRequestError('username already exists');

	if (phoneNumber) {
		const total = await runQuery(countUsersMatchingSearchQuery, [{ phoneNumber, id }]);
		if (total !== 1) throw getBadRequestError('phone number already exists');
	}

	if (email) {
		const total = await runQuery(countUsersMatchingSearchQuery, [{ email, id }]);
		if (total !== 1) throw getBadRequestError('email already exists');
	}

	// upload image to firebase storage bucket
	const downloadURL = await uploadUserProfileImage(id, image);

	const profile = Object.assign({}, data, { image: downloadURL });

	const user: any = await runInTransaction(updateUserTransaction(profile));
	const { password, ...other } = user;

	return other;
};

export const checkUsernameOrEmailExists = async (username: string, email: string) => {
	const totalMatchingUsernameCount = !username
		? 0
		: await runQuery(countMatchingUsernameQuery, [username]);
	const totalMatchingEmailCount = !email ? 0 : await runQuery(countMatchingEmailQuery, [email]);
	return {
		username: Boolean(totalMatchingUsernameCount),
		email: Boolean(totalMatchingEmailCount)
	};
};

export const updateUserPassword = async (id: string, password: string) => {
	const user = await runQuery(getUserByIdQuery, [id]);
	if (!user) throw getBadRequestError('Invalid user account');

	if (bcryptjs.compareSync(password, user.password)) {
		throw getBadRequestError('Cannot enter the same password');
	}

	const hashedPassword = bcryptjs.hashSync(password, Constants.misc.BCRYPT_HASHING_SALT);

	await runQuery(updateUserProfileQuery, [{ id, password: hashedPassword }]);

	return true;
};
