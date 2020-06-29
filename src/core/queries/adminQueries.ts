import { SERVER } from 'base/config/server';
import { Users } from 'core/models/node/users';
import { EntityManager } from 'typeorm';

export const countExistingSuperAdminQuery = (manager: EntityManager) => {
	return manager
		.createQueryBuilder(Users, 'u')
		.where('u.roles LIKE :role')
		.setParameter('role', `%${SERVER.privileges.SUPER_ADMIN}%`)
		.getCount();
};
