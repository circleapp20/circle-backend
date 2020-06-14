import { Constants } from 'shared/constants';
import * as database from 'shared/node/database';
import * as queries from 'shared/node/queries';
import { entities, Users } from 'shared/node/schema';
import { entityManager as manager } from 'shared/testUtils/node/entityManager';
import * as typeorm from 'typeorm';

jest.mock('typeorm', () => {
	const { entityManager } = jest.requireActual('shared/testUtils/node/entityManager');
	return {
		createConnection: jest.fn().mockReturnValue({
			manager: entityManager,
			close: jest.fn(),
			transaction: jest.fn().mockImplementation((callBack) => {
				return callBack(entityManager);
			})
		})
	};
});
jest.mock('shared/node/schema');

beforeEach(() => jest.clearAllMocks());

const queryMockFunc: any = jest.fn().mockReturnValue({ generatedMaps: [] });

describe('#getSqlInstance', () => {
	// https://stackoverflow.com/questions/48033841/test-process-env-with-jest
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules(); // this is important - it clears the cache
		process.env = { ...OLD_ENV };
		delete (process.env as any).NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
	});

	test('should be called with the database url', async () => {
		await database.getSqlInstance();
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'mysql',
			url: Constants.app.DATABASE_URL,
			name: 'default',
			entities
		});
	});

	test('should create new connection with different name', async () => {
		await database.getSqlInstance('testing');
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'mysql',
			url: Constants.app.DATABASE_URL,
			name: 'testing',
			entities
		});
	});

	test('should add postgres and ssl for production env', async () => {
		(process.env as any).NODE_ENV = 'production';
		await database.getSqlInstance('testing');
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'postgres',
			url: Constants.app.DATABASE_URL,
			name: 'testing',
			entities,
			extra: { ssl: { rejectUnauthorized: false } },
			ssl: true
		});
	});
});

describe('#runInsertQuery', () => {
	test('should call queryBuilder function with a manager and params', async () => {
		await database.runInsertQuery(queryMockFunc, ['9393-8382-8832']);
		expect(queryMockFunc).toHaveBeenCalledWith(
			expect.objectContaining(manager),
			expect.stringMatching('9393-8382-8832')
		);
	});

	test('should pass the manager to the queryBuilder', async () => {
		await database.runInsertQuery(queryMockFunc, ['9'], manager);
		expect(queryMockFunc).toHaveBeenCalledWith(manager, '9');
	});
});

describe('#runQuery', () => {
	test('should call queryBuilder function with entity manager', async () => {
		await database.runQuery(queryMockFunc);
		expect(queryMockFunc).toHaveBeenCalledWith(expect.objectContaining(manager));
	});

	test('should pass params as arguments to queryBuilder function', async () => {
		await database.runQuery(queryMockFunc, ['test', 3]);
		expect(queryMockFunc).toHaveBeenCalledWith(
			expect.objectContaining(manager),
			expect.stringMatching('test'),
			3
		);
	});

	test('should call queryBuilder with entity manager args', async () => {
		await database.runQuery(queryMockFunc, ['test'], manager);
		expect(queryMockFunc).toHaveBeenCalledWith(manager, 'test');
	});

	test('should call queryBuilder with entity manager as params', async () => {
		await database.runQuery(queryMockFunc, manager);
		expect(queryMockFunc).toHaveBeenCalledWith(manager);
	});
});

describe('#runInTransaction', () => {
	test('should pass an entity manager to the callBack function', async () => {
		const mockFn = jest.fn();
		await database.runInTransaction(mockFn);
		expect(mockFn).toHaveBeenCalled();
		expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({}));
	});

	test('should return the value from the callback', async () => {
		const mockFn = jest.fn().mockResolvedValueOnce('success');
		const results = await database.runInTransaction(mockFn);
		expect(results).toBe('success');
	});
});
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

describe('#addUserAsSuperAdmin', () => {
	test('should call the runInsertQuery with the profile of the super admin', async () => {
		const spy = jest.spyOn(queries, 'addUserProfileQuery');
		await database.addUserAsSuperAdmin(manager);
		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining(manager),
			expect.objectContaining({
				biography: expect.any(String),
				dob: expect.any(Date),
				email: expect.any(String),
				image: expect.any(String),
				isEmailVerified: true,
				name: expect.any(String),
				password: expect.any(String),
				phoneNumber: expect.any(String),
				roles: expect.arrayContaining([
					Constants.privileges.SUPER_ADMIN,
					Constants.privileges.USER
				]),
				username: expect.any(String),
				verificationCode: expect.any(String)
			})
		);
	});
});

describe('#createCircleSuperAdmin', () => {
	test('should create a super admin if no super exists', async () => {
		const spy = jest.spyOn(queries, 'addUserProfileQuery');
		manager.getCount.mockReturnValueOnce(0);
		await database.createCircleSuperAdmin();
		expect(spy).toHaveBeenCalled();
	});

	test('should not create super admin if at least one exists', async () => {
		const spy = jest.spyOn(queries, 'addUserProfileQuery');
		manager.getCount.mockReturnValueOnce(1);
		await database.createCircleSuperAdmin();
		expect(spy).not.toHaveBeenCalled();
	});
});

describe('#setupCircleDatabase', () => {
	const spy = jest.spyOn(queries, 'addUserProfileQuery');

	test('should call createCircleSuperAdmin when database exists or created', async () => {
		await database.setupCircleDatabase();
		expect(spy).toHaveBeenCalled();
	});

	test('should not call createCircleSuperAdmin when database failed to initialize', async () => {
		spy.mockRestore();
		await database.setupCircleDatabase();
		expect(spy).not.toHaveBeenCalled();
	});
});
