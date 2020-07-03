import { SERVER } from 'base/config/server';
import * as dBInstance from 'core/database/dBInstance';
import { entities } from 'core/models/node/entities';
import * as typeorm from 'typeorm';

jest.mock('typeorm', () => {
	const { entityManager } = jest.requireActual('base/testUtils/node/entityManager');
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
jest.mock('core/models/node/users');
jest.mock('core/models/node/fellows');
jest.mock('core/models/node/locations');
jest.mock('core/models/node/entities');

beforeEach(() => jest.clearAllMocks());

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
		await dBInstance.getSqlInstance();
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'mysql',
			url: SERVER.app.DATABASE_URL,
			name: 'default',
			entities
		});
	});

	test('should create new connection with different name', async () => {
		await dBInstance.getSqlInstance('testing');
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'mysql',
			url: SERVER.app.DATABASE_URL,
			name: 'testing',
			entities
		});
	});

	test('should add postgres and ssl for production env', async () => {
		(process.env as any).NODE_ENV = 'production';
		await dBInstance.getSqlInstance('testing');
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'postgres',
			url: SERVER.app.DATABASE_URL,
			name: 'testing',
			entities,
			extra: { ssl: { rejectUnauthorized: false } },
			ssl: true
		});
	});
});
