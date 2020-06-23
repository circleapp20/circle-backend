import { IAddUserProfile } from 'base/types';
import { Users } from 'core/models/node/users';
import { EntityManager } from 'typeorm';

export const getUserByIdQuery = (manager: EntityManager, id: string) => {
	return manager
		.createQueryBuilder(Users, 'users')
		.leftJoinAndSelect('users.locations', 'locations')
		.where('users.id = :id', { id })
		.getOne();
};

export const getUserByCredentialsQuery = (
	manager: EntityManager,
	values: { email?: string; phoneNumber?: string; username?: string }
) => {
	const { email, phoneNumber, username } = values;
	const query = manager.createQueryBuilder(Users, 'u');
	if (username) query.where('u.username = :username', { username });
	else if (phoneNumber) query.where('u.phoneNumber = :phoneNumber', { phoneNumber });
	else query.where('u.email = :email', { email });
	return query.getOne();
};

export const addUserProfileQuery = (manager: EntityManager, values: IAddUserProfile) => {
	return manager.createQueryBuilder(Users, 'u').insert().values(values).execute();
};
