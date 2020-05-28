import bcryptjs from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { getBadRequestError } from '../../_shared/services';
import { getUserByIdQuery } from '../../_shared/services/dataService';
import { runInTransaction, runQuery } from '../../_shared/services/dBService';
import { countMatchingUsernameQuery, updateUserProfileQuery } from './queryBuilder';
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
	const { username, id, password: rawPassword } = data;
	if (!id) throw getBadRequestError('id is required');

	if (!rawPassword) throw getBadRequestError('password is required');

	const count = await runQuery(countMatchingUsernameQuery, [username]);
	if (Boolean(count)) throw getBadRequestError('username already exists');

	const user: any = await runInTransaction(updateUserTransaction(data));
	const { password, ...other } = user;

	return other;
};
