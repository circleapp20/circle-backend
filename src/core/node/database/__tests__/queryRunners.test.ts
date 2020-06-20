import { entityManager as manager } from 'base/testUtils/node/entityManager';
import * as queryRunner from 'core/node/database/queryRunners';

jest.mock('core/node/database/dBInstance');

beforeEach(() => jest.clearAllMocks());

const queryMockFunc: any = jest.fn().mockReturnValue({ generatedMaps: [] });

describe('#runInsertQuery', () => {
	test('should call queryBuilder function with a manager and params', async () => {
		await queryRunner.runInsertQuery(queryMockFunc, ['9393-8382-8832']);
		expect(queryMockFunc).toHaveBeenCalledWith(
			expect.objectContaining(manager),
			expect.stringMatching('9393-8382-8832')
		);
	});

	test('should pass the manager to the queryBuilder', async () => {
		await queryRunner.runInsertQuery(queryMockFunc, ['9'], manager);
		expect(queryMockFunc).toHaveBeenCalledWith(manager, '9');
	});
});

describe('#runQuery', () => {
	test('should call queryBuilder function with entity manager', async () => {
		await queryRunner.runQuery(queryMockFunc);
		expect(queryMockFunc).toHaveBeenCalledWith(expect.objectContaining(manager));
	});

	test('should pass params as arguments to queryBuilder function', async () => {
		await queryRunner.runQuery(queryMockFunc, ['test', 3]);
		expect(queryMockFunc).toHaveBeenCalledWith(
			expect.objectContaining(manager),
			expect.stringMatching('test'),
			3
		);
	});

	test('should call queryBuilder with entity manager args', async () => {
		await queryRunner.runQuery(queryMockFunc, ['test'], manager);
		expect(queryMockFunc).toHaveBeenCalledWith(manager, 'test');
	});

	test('should call queryBuilder with entity manager as params', async () => {
		await queryRunner.runQuery(queryMockFunc, manager);
		expect(queryMockFunc).toHaveBeenCalledWith(manager);
	});
});

describe('#runInTransaction', () => {
	test('should pass an entity manager to the callBack function', async () => {
		const mockFn = jest.fn();
		await queryRunner.runInTransaction(mockFn);
		expect(mockFn).toHaveBeenCalled();
		expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({}));
	});

	test('should return the value from the callback', async () => {
		const mockFn = jest.fn().mockResolvedValueOnce('success');
		const results = await queryRunner.runInTransaction(mockFn);
		expect(results).toBe('success');
	});
});
