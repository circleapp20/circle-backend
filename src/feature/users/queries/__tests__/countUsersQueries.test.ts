import { Users } from 'base/common/schema/users';
import { entityManager } from 'base/testUtils/node/entityManager';
import {
	countMatchingEmailQuery,
	countMatchingUsernameQuery,
	countUsersMatchingSearchQuery
} from '../countUsersQueries';

jest.mock('base/common/schema/users');

describe('#countMatchingUsernameQuery', () => {
	test('should search Users table matching username', async () => {
		const username = 'test';
		await countMatchingUsernameQuery(entityManager, username);
		expect(entityManager.where).toHaveBeenCalledWith('u.username = :username', {
			username
		});
		expect(entityManager.getCount).toHaveBeenCalled();
	});
});

describe('#countMatchingEmailQuery', () => {
	test('should create query builder with the Users schema', async () => {
		await countMatchingEmailQuery(entityManager, 'test@test.com');
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
	});

	test('should search users table with email', async () => {
		const email = 'test@test.com';
		await countMatchingEmailQuery(entityManager, email);
		expect(entityManager.where).toHaveBeenCalledWith('u.email = :email', { email });
	});

	test('should call getCount on the entityManager', async () => {
		await countMatchingEmailQuery(entityManager, 'test@test.com');
		expect(entityManager.getCount).toHaveBeenCalled();
	});
});

describe('#countUsersMatchingSearchQuery', () => {
	const values = {
		id: 'iw83',
		email: '',
		phoneNumber: '',
		username: ''
	};

	test('should search the users table', async () => {
		await countUsersMatchingSearchQuery(entityManager, values);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
	});

	test('should call where with the user id', async () => {
		await countUsersMatchingSearchQuery(entityManager, values);
		expect(entityManager.where).toHaveBeenCalledWith('u.id = :id', { id: 'iw83' });
	});

	test('should call orWhere with phoneNumber if defined', async () => {
		const data = Object.assign({}, values, { phoneNumber: '555-555-5555' });
		await countUsersMatchingSearchQuery(entityManager, data);
		expect(entityManager.orWhere).toHaveBeenCalledWith('u.phoneNumber = :phoneNumber', {
			phoneNumber: '555-555-5555'
		});
	});

	test('should call orWhere with email if defined', async () => {
		const data = Object.assign({}, values, { email: 'test@test.com' });
		await countUsersMatchingSearchQuery(entityManager, data);
		expect(entityManager.orWhere).toHaveBeenCalledWith('u.email = :email', {
			email: 'test@test.com'
		});
	});

	test('should call orWhere with username if defined', async () => {
		const data = Object.assign({}, values, { username: 'test' });
		await countUsersMatchingSearchQuery(entityManager, data);
		expect(entityManager.orWhere).toHaveBeenCalledWith('u.username = :username', {
			username: 'test'
		});
	});

	test('should call getCount to count the search results', async () => {
		await countUsersMatchingSearchQuery(entityManager, values);
		expect(entityManager.getCount).toHaveBeenCalled();
	});
});
