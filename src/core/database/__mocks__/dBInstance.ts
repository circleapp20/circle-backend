const { entityManager } = jest.requireActual('base/testUtils/node/entityManager');

export const getSqlInstance = jest.fn(async () => ({
	manager: entityManager,
	close: jest.fn(),
	transaction: jest.fn((callback) => callback(entityManager))
}));
