import { createConnection } from 'typeorm';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { Constants } from '../../constants';
import { getSqlInstance, runInsertQuery, runInTransaction, runQuery } from '../dBService';
import entities from '../schemaService';

jest.mock('typeorm', () => ({
	createConnection: jest.fn().mockReturnValue({
		manager: {},
		close: jest.fn(),
		transaction: jest.fn().mockImplementation((callBack) => {
			return callBack({
				getRepository: jest.fn().mockReturnThis(),
				createQueryBuilder: jest.fn().mockReturnThis(),
				where: jest.fn().mockReturnThis(),
				getOne: jest.fn(),
				insert: jest.fn().mockReturnThis(),
				values: jest.fn().mockReturnThis(),
				execute: jest.fn().mockReturnValue({
					generatedMaps: []
				}),
				getCount: jest.fn(),
				andWhere: jest.fn().mockReturnThis(),
				update: jest.fn().mockReturnThis(),
				set: jest.fn().mockReturnThis()
			});
		})
	})
}));
jest.mock('../schemaService');

beforeEach(() => jest.clearAllMocks());

describe('#dBService', () => {
	const queryMockFunc: any = jest.fn().mockReturnValue({
		generatedMaps: []
	});

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
			await getSqlInstance();
			expect(createConnection).toHaveBeenCalledWith({
				type: 'mysql',
				url: Constants.app.DATABASE_URL,
				name: 'default',
				entities,
				synchronize: false
			});
		});

		test('should synchronize database with synchronize set to true', async () => {
			await getSqlInstance('default', true);
			expect(createConnection).toHaveBeenCalledWith({
				type: 'mysql',
				url: Constants.app.DATABASE_URL,
				name: 'default',
				entities,
				synchronize: true
			});
		});

		test('should create new connection with different name', async () => {
			await getSqlInstance('testing');
			expect(createConnection).toHaveBeenCalledWith({
				type: 'mysql',
				url: Constants.app.DATABASE_URL,
				name: 'testing',
				entities,
				synchronize: false
			});
		});

		test('should add postgres and ssl for production env', async () => {
			(process.env as any).NODE_ENV = 'production';
			await getSqlInstance('testing');
			expect(createConnection).toHaveBeenCalledWith({
				type: 'postgres',
				url: Constants.app.DATABASE_URL,
				name: 'testing',
				entities,
				synchronize: false,
				extra: { ssl: { rejectUnauthorized: false } },
				ssl: true
			});
		});
	});

	describe('#runInsertQuery', () => {
		test('should call queryBuilder function with a manager and params', async () => {
			await runInsertQuery(queryMockFunc, ['9393-8382-8832']);
			expect(queryMockFunc).toBeCalledTimes(1);
			expect(queryMockFunc).toHaveBeenCalledWith({}, '9393-8382-8832');
		});

		test('should pass the manager to the queryBuilder', async () => {
			await runInsertQuery(queryMockFunc, ['9'], entityManager);
			expect(queryMockFunc).toHaveBeenCalledWith(entityManager, '9');
		});
	});

	describe('#runQuery', () => {
		test('should call queryBuilder function with entity manager', async () => {
			await runQuery(queryMockFunc);
			expect(queryMockFunc).toHaveBeenCalledTimes(1);
			expect(queryMockFunc).toHaveBeenCalledWith({});
		});

		test('should pass params as arguments to queryBuilder function', async () => {
			await runQuery(queryMockFunc, ['test', 3]);
			expect(queryMockFunc).toHaveBeenCalledWith({}, 'test', 3);
		});

		test('should call queryBuilder with entity manager args', async () => {
			await runQuery(queryMockFunc, ['test'], entityManager);
			expect(queryMockFunc).toHaveBeenCalledWith(entityManager, 'test');
		});

		test('should call queryBuilder with entity manager as params', async () => {
			await runQuery(queryMockFunc, entityManager);
			expect(queryMockFunc).toHaveBeenCalledWith(entityManager);
		});
	});

	describe('#runInTransaction', () => {
		test('should pass an entity manager to the callBack function', async () => {
			const mockFn = jest.fn();
			await runInTransaction(mockFn);
			expect(mockFn).toHaveBeenCalled();
			expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({}));
		});

		test('should return the value from the callback', async () => {
			const mockFn = jest.fn().mockResolvedValueOnce('success');
			const results = await runInTransaction(mockFn);
			expect(results).toBe('success');
		});
	});
});
