import { entityManagerMock as entityManager } from '../../../__testSetup__';

export const runInsertQuery = jest
	.fn()
	.mockImplementation((queryBuilder, params, manager = entityManager) => {
		return queryBuilder(manager, ...params);
	});

export const runQuery = jest
	.fn()
	.mockImplementation((queryBuilder, params, manager = entityManager) => {
		const eM = params && !Array.isArray(params) ? params : manager;
		const queryParams = params && Array.isArray(params) ? params : [];
		return queryBuilder(eM, ...queryParams);
	});

export const runInTransaction = async (callBack: any) => await callBack(entityManager);

export const getSqlInstance = jest.fn().mockResolvedValue({
	manager: entityManager,
	close: jest.fn().mockResolvedValue(true),
	transaction: jest.fn((callback) => callback(entityManager))
});
