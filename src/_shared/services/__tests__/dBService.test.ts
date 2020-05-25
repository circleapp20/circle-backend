import { createConnection } from 'typeorm';
import { Constants } from '../../constants';
import { getSqlInstance, runInsertQuery } from '../dBService';
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

beforeAll(() => {
	jest.clearAllMocks();
});

describe('#dBService', () => {
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
		const queryMockFunc: any = jest.fn().mockReturnValue({
			generatedMaps: []
		});

		test('should call queryBuilder function with a manager and params', async () => {
			await runInsertQuery(queryMockFunc, ['9393-8382-8832']);
			expect(queryMockFunc).toBeCalledTimes(1);
			expect(queryMockFunc).toHaveBeenCalledWith({}, '9393-8382-8832');
		});

		test('should pass the manager to the queryBuilder', async () => {
			await runInsertQuery(queryMockFunc, ['9'], { testing: 1 } as any);
			expect(queryMockFunc).toHaveBeenCalledWith({ testing: 1 }, '9');
		});
	});
});
