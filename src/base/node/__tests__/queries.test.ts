import { Fellows } from 'base/common/schema/fellows';
import { Users } from 'base/common/schema/users';
import { Constants } from 'base/constants';
import * as queries from 'base/node/queries';
import { entityManager } from 'base/testUtils/node/entityManager';
import { IAddUserProfile } from 'base/types';

jest.mock('base/common/schema/fellows');
jest.mock('base/common/schema/users');

beforeEach(() => jest.clearAllMocks());

describe('#getUserByIdQuery', () => {
	const id = 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77';

	test('should create query builder from Users with the id', async () => {
		await queries.getUserByIdQuery(entityManager, id);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
	});

	test('should match user id with id in the where clause', async () => {
		await queries.getUserByIdQuery(entityManager, id);
		expect(entityManager.where).toHaveBeenCalledWith('u.id = :id', { id });
	});

	test('should only get one matching user', async () => {
		await queries.getUserByIdQuery(entityManager, id);
		expect(entityManager.getOne).toHaveBeenCalled();
	});
});

describe('#getUserByCredentialsQuery', () => {
	test('should search database with username if defined', async () => {
		const values = { username: 'username', phoneNumber: '', email: '' };
		await queries.getUserByCredentialsQuery(entityManager, values);
		expect(entityManager.where).toHaveBeenCalledWith('u.username = :username', {
			username: values.username
		});
	});

	test('should search users with phoneNumber', async () => {
		const values = { username: '', phoneNumber: '+1-422-847-4939', email: '' };
		await queries.getUserByCredentialsQuery(entityManager, values);
		expect(entityManager.where).toHaveBeenCalledWith('u.phoneNumber = :phoneNumber', {
			phoneNumber: values.phoneNumber
		});
	});

	test('should search users with email if defined', async () => {
		const values = { username: '', phoneNumber: '', email: 'test@test.com' };
		await queries.getUserByCredentialsQuery(entityManager, values);
		expect(entityManager.where).toHaveBeenCalledWith('u.email = :email', {
			email: values.email
		});
	});
});

describe('#addUserProfileQuery', () => {
	const profile: IAddUserProfile = {
		username: '',
		password: '',
		dob: new Date(),
		image: '',
		biography: '',
		email: '',
		phoneNumber: '',
		isEmailVerified: false,
		verificationCode: '',
		roles: [Constants.privileges.USER],
		name: ''
	};

	test('should be called with an entity manager', async () => {
		await queries.addUserProfileQuery(entityManager, profile);
		expect(entityManager.insert).toHaveBeenCalledTimes(1);
		expect(entityManager.values).toHaveBeenCalledTimes(1);
		expect(entityManager.execute).toHaveBeenCalledTimes(1);
	});

	test('should call values with profile value', async () => {
		await queries.addUserProfileQuery(entityManager, profile);
		expect(entityManager.values).toHaveBeenCalledWith(profile);
	});

	test('should return insert query results', async () => {
		const results = await queries.addUserProfileQuery(entityManager, profile);
		expect(results).toEqual({ generatedMaps: [] });
	});
});

describe('#countExistingSuperAdminQuery', () => {
	test('should create a query builder with an alias of u for Users', async () => {
		await queries.countExistingSuperAdminQuery(entityManager);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
	});

	test('should search user roles that contains super admin privilege', async () => {
		await queries.countExistingSuperAdminQuery(entityManager);
		expect(entityManager.where).toHaveBeenCalledWith('u.roles LIKE :role');
	});

	test('should set roles parameter with super admin privileges', async () => {
		await queries.countExistingSuperAdminQuery(entityManager);
		expect(entityManager.setParameter).toHaveBeenCalledWith(
			'role',
			`%${Constants.privileges.SUPER_ADMIN}%`
		);
	});

	test('should get the total count of super admins', async () => {
		await queries.countExistingSuperAdminQuery(entityManager);
		expect(entityManager.getCount).toHaveBeenCalled();
	});
});

describe('#addUserToFellowsQuery', () => {
	const data = { id: 'os83mc28', secretCode: 'secret' };

	test('should return undefined if id is invalid', async () => {
		await queries.addUserToFellowsQuery(entityManager, { id: '', secretCode: '' });
		expect(entityManager.createQueryBuilder).not.toHaveBeenCalled();
	});

	test('should not call createQueryBuilder with invalid secretCode', async () => {
		await queries.addUserToFellowsQuery(entityManager, { id: 'os83mc28', secretCode: '' });
		expect(entityManager.createQueryBuilder).not.toHaveBeenCalled();
	});

	test('should create a query with fellow as alias for Fellows schema', async () => {
		await queries.addUserToFellowsQuery(entityManager, data);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Fellows, 'fellow');
	});

	test('should call the insert on the query builder', async () => {
		await queries.addUserToFellowsQuery(entityManager, data);
		expect(entityManager.insert).toHaveBeenCalled();
	});

	test('should pass the user id and secretCode to the values function of insert', async () => {
		await queries.addUserToFellowsQuery(entityManager, data);
		expect(entityManager.values).toHaveBeenCalledWith(
			expect.objectContaining({ user: { id: 'os83mc28' }, secretCode: 'secret' })
		);
	});

	test('should return the executed insert query', async () => {
		await queries.addUserToFellowsQuery(entityManager, data);
		expect(entityManager.execute).toHaveBeenCalled();
	});
});
