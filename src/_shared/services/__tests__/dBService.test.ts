import { createConnection } from 'typeorm';
import { Constants } from '../../constants';
import { getSqlInstance, runInsertQuery, runQuery } from '../dBService';
import entities from '../schemaService';

jest.mock('typeorm', () => ({
	createConnection: jest.fn().mockReturnValue({
		manager: {},
		close: jest.fn()
	}),
	PrimaryGeneratedColumn: () => jest.fn(),
	CreateDateColumn: () => jest.fn(),
	UpdateDateColumn: () => jest.fn(),
	Column: () => jest.fn(),
	Entity: () => jest.fn()
}));

beforeEach(() => {
	jest.clearAllMocks();
});

describe('#dBService', () => {
	const queryMockFunc: any = jest.fn().mockReturnValue({
		generatedMaps: []
	});

	const entityManager: any = { testing: 1 };

	describe('#getSqlInstance', () => {
		test('should be called with the database url', async () => {
			await getSqlInstance();
			expect(createConnection).toBeCalled();
			expect(createConnection).toBeCalledTimes(1);
			expect(createConnection).toBeCalledWith({
				type: 'mysql',
				url: Constants.app.DATABASE_URL,
				name: 'default',
				entities
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
});
