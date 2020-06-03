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

export const countUsersMatchingSearchQuery = (
	manager: EntityManager,
	values: { email: string; phoneNumber: string; id: string; username: string }
) => {
	const { email, phoneNumber, id, username } = values;
	const query = manager.getRepository(Users).createQueryBuilder('u').where('u.id = :id', { id });
	if (username) query.orWhere('u.username = :username', { username });
	else if (phoneNumber) query.orWhere('u.phoneNumber = :phoneNumber', { phoneNumber });
	else query.orWhere('u.email = :email', { email });
	return query.getCount();
};
