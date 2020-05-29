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
			return callBack(entityManager);
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
			// @ts-ignore
			process.env.NODE_ENV = 'production';
			await getSqlInstance('testing');
			expect(createConnection).toHaveBeenCalledWith({
				type: 'postgres',
				url: Constants.app.DATABASE_URL,
				name: 'testing',
				entities,
				synchronize: false,
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
			expect(mockFn).toHaveBeenCalledWith(entityManager);
		});

		test('should return the value from the callback', async () => {
			const mockFn = jest.fn().mockResolvedValueOnce('success');
			const results = await runInTransaction(mockFn);
			expect(results).toBe('success');
		});
	});
});
