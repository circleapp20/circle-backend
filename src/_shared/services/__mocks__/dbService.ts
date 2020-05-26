import { entityManagerMock as entityManager } from '../../../__utils__/testUtils';

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

export const runInTransaction = jest
	.fn()
	.mockImplementation(async (callBack) => await callBack(entityManager));
