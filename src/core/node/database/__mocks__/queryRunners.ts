const { entityManager } = jest.requireActual('base/testUtils/node/entityManager');

export const runInsertQuery = jest.fn(async (queryBuilder, params, manager = entityManager) => {
	const results = await queryBuilder(manager, ...params);
	return results.generateMaps;
});

export const runQuery = jest.fn((queryBuilder, params, manager = entityManager) => {
	const eM = params && !Array.isArray(params) ? params : manager;
	const queryParams = params && Array.isArray(params) ? params : [];
	return queryBuilder(eM, ...queryParams);
});

export const runInTransaction = jest.fn(async (callBack: any) => await callBack(entityManager));
