import { Constants } from 'base/config/node/constants';
import { Users } from 'core/models/node/users';
import { EntityManager } from 'typeorm';

export const countExistingSuperAdminQuery = (manager: EntityManager) => {
	return manager
		.createQueryBuilder(Users, 'u')
		.where('u.roles LIKE :role')
		.setParameter('role', `%${Constants.privileges.SUPER_ADMIN}%`)
		.getCount();
};
