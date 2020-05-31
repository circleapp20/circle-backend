import bcryptjs from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { getBadRequestError } from '../../_shared/services';
import { getUserByIdQuery } from '../../_shared/services/dataService';
import { runInTransaction, runQuery } from '../../_shared/services/dBService';
import {
	countMatchingEmailQuery,
	countMatchingUsernameQuery,
	updateUserProfileQuery
} from './queryBuilder';
import { uploadUserProfileImage } from './usersService';
import { IUpdateUserProfile } from './_helpers/types';

export const updateUserTransaction = (data: IUpdateUserProfile) => {
	return async (manager: EntityManager) => {
		const password = bcryptjs.hashSync(data.password, 12);
		const profile = Object.assign({}, data, { password });
		await runQuery(updateUserProfileQuery, [profile], manager);
		return runQuery(getUserByIdQuery, [data.id], manager);
	};
};

export const updateUserProfile = async (data: IUpdateUserProfile) => {
	const { username, id, password: rawPassword, image } = data;
	if (!id) throw getBadRequestError('id is required');

	if (!rawPassword) throw getBadRequestError('password is required');

	const count = await runQuery(countMatchingUsernameQuery, [username]);
	if (count) throw getBadRequestError('username already exists');

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
