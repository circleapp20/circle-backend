import { Fellows } from 'base/common/schema/fellows';
import { Users } from 'base/common/schema/users';
import { Constants } from 'base/constants';
import { IAddUserProfile } from 'base/types';
import { EntityManager } from 'typeorm';

export const getUserByIdQuery = (manager: EntityManager, id: string) => {
	return manager.createQueryBuilder(Users, 'u').where('u.id = :id', { id }).getOne();
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

export const countExistingSuperAdminQuery = (manager: EntityManager) => {
	return manager
		.createQueryBuilder(Users, 'u')
		.where('u.roles LIKE :role')
		.setParameter('role', `%${Constants.privileges.SUPER_ADMIN}%`)
		.getCount();
};

export const addUserToFellowsQuery = async (
	manager: EntityManager,
	values: { id: string; secretCode: string }
) => {
	const { id, secretCode } = values;
	if (!id || !secretCode) return;
	return manager
		.createQueryBuilder(Fellows, 'fellow')
		.insert()
		.values({ user: { id }, secretCode })
		.execute();
};
