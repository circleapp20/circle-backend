import { SERVER } from 'base/config/server';
import { entityManager } from 'base/testUtils/node/entityManager';
import { Users } from 'core/models/node/users';
import { countExistingSuperAdminQuery } from 'core/queries/adminQueries';

jest.mock('core/models/node/fellows');
jest.mock('core/models/node/users');

beforeEach(() => jest.clearAllMocks());

describe('#countExistingSuperAdminQuery', () => {
	test('should create a query builder with an alias of u for Users', async () => {
		await countExistingSuperAdminQuery(entityManager);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
	});

	test('should search user roles that contains super admin privilege', async () => {
		await countExistingSuperAdminQuery(entityManager);
		expect(entityManager.where).toHaveBeenCalledWith('u.roles LIKE :role');
	});

	test('should set roles parameter with super admin privileges', async () => {
		await countExistingSuperAdminQuery(entityManager);
		expect(entityManager.setParameter).toHaveBeenCalledWith(
			'role',
			`%${SERVER.privileges.SUPER_ADMIN}%`
		);
	});

	test('should get the total count of super admins', async () => {
		await countExistingSuperAdminQuery(entityManager);
		expect(entityManager.getCount).toHaveBeenCalled();
	});
});
