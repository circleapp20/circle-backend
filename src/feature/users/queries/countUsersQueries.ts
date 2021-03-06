import { Users } from 'core/models/node/users';
import { EntityManager } from 'typeorm';

export const countMatchingUsernameQuery = (manager: EntityManager, username: string) => {
	return manager
		.createQueryBuilder(Users, 'u')
		.where('u.username = :username', { username })
		.getCount();
};

export const countMatchingEmailQuery = (manager: EntityManager, email: string) => {
	return manager.createQueryBuilder(Users, 'u').where('u.email = :email', { email }).getCount();
};

export const countUsersMatchingSearchQuery = (
	manager: EntityManager,
	values: { email: string; phoneNumber: string; id: string; username: string }
) => {
	const { email, phoneNumber, id, username } = values;
	const query = manager.createQueryBuilder(Users, 'u').where('u.id = :id', { id });
	if (username) query.orWhere('u.username = :username', { username });
	else if (phoneNumber) query.orWhere('u.phoneNumber = :phoneNumber', { phoneNumber });
	else query.orWhere('u.email = :email', { email });
	return query.getCount();
};
