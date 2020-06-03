import { EntityManager } from 'typeorm';
import { Users } from './schemaService';

export const getUserByIdQuery = (manager: EntityManager, id: string) => {
	return manager.getRepository(Users).createQueryBuilder().where('id = :id', { id }).getOne();
};

export const getUserByCredentialsQuery = (
	manager: EntityManager,
	values: { email?: string; phoneNumber?: string; username?: string }
) => {
	const { email, phoneNumber, username } = values;
	const query = manager.getRepository(Users).createQueryBuilder('u');
	if (username) query.where('u.username = :username', { username });
	else if (phoneNumber) query.where('u.phoneNumber = :phoneNumber', { phoneNumber });
	else query.where('u.email = :email', { email });
	return query.getOne();
};
