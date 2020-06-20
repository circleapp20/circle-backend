import { Users } from 'base/common/schema/users';
import { entityManager, entityManager as manager } from 'base/testUtils/node/entityManager';
import * as database from 'core/node/database/createCircleDatabase';
import { setupCircleDatabase } from 'core/node/database/createCircleDatabase';
import { createCircleSuperAdmin } from '../createSuperAdmin';
import { runInTransaction } from '../queryRunners';

jest.mock('base/common/schema/users');
jest.mock('base/common/schema/fellows');
jest.mock('base/common/schema/locations');
jest.mock('core/node/database/queryRunners');
jest.mock('core/node/database/dBInstance');
jest.mock('core/node/database/createSuperAdmin', () => ({
	createCircleSuperAdmin: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#checkDatabaseExistsQuery', () => {
	test('should create query using the Users table', async () => {
		await database.checkDatabaseExistsQuery(manager);
		expect(manager.createQueryBuilder).toHaveBeenCalledWith(Users, 'users');
	});

	test('should limit the search to only 1', async () => {
		await database.checkDatabaseExistsQuery(manager);
		expect(manager.limit).toHaveBeenCalledWith(1);
	});
});

describe('#checkIfDataBaseExists', () => {
	test('should return true if runQuery resolves successfully', async () => {
		const exists = await database.checkIfDataBaseExists();
		expect(exists).toBeTruthy();
	});

	test('should return false if runQuery rejects', async () => {
		manager.execute.mockRejectedValueOnce(new Error());
		const exists = await database.checkIfDataBaseExists();
		expect(exists).toBeFalsy();
	});
});

describe('#createDBSchema', () => {
	test('should not create database schema if exists', async () => {
		const results = await database.createDBSchema();
		expect(results).toEqual({ state: 'exists', success: true });
	});

	test('should create the database schema', async () => {
		manager.execute.mockRejectedValueOnce(new Error());
		const results = await database.createDBSchema();
		expect(results).toEqual({ state: 'created', success: true });
	});

	test('should fail if synchronization fails', async () => {
		manager.execute.mockRejectedValueOnce(new Error());
		manager.connection.synchronize.mockRejectedValueOnce(new Error());
		const results = await database.createDBSchema();
		expect(results).toEqual({ state: 'failed', success: false });
	});
});

describe('#setupCircleDatabase', () => {
	test('should call createCircleSuperAdmin when database exists or created', async () => {
		await setupCircleDatabase();
		expect(createCircleSuperAdmin).toHaveBeenCalled();
	});

	test('should not call createCircleSuperAdmin when database failed to initialize', async () => {
		entityManager.execute.mockImplementationOnce(() => {
			throw new Error();
		});
		(<any>runInTransaction).mockImplementationOnce(() => {
			throw new Error();
		});
		await setupCircleDatabase();
		expect(createCircleSuperAdmin).not.toHaveBeenCalled();
	});
});
