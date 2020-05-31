import { EntityManager } from 'typeorm';
import { Users } from '../../_shared/services';
import { IUpdateUserProfile } from './_helpers/types';

export const updateUserProfileQuery = (manager: EntityManager, values: IUpdateUserProfile) => {
	const { id, ...rest } = values;
	return manager
		.getRepository(Users)
		.createQueryBuilder()
		.update()
		.set(rest)
		.where('id = :id', { id })
		.execute();
};

export const countMatchingUsernameQuery = (manager: EntityManager, username: string) => {
	return manager
		.getRepository(Users)
		.createQueryBuilder()
		.where('username = :username', { username })
		.getCount();
};

export const countMatchingEmailQuery = (manager: EntityManager, email: string) => {
	return manager
		.getRepository(Users)
		.createQueryBuilder()
		.where('email = :email', { email })
		.getCount();
};
