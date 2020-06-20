import { entities } from 'base/common/schema/entities';
import { Constants } from 'base/constants';
import * as dBInstance from 'core/node/database/dBInstance';
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
jest.mock('base/common/schema/users');
jest.mock('base/common/schema/fellows');
jest.mock('base/common/schema/locations');
jest.mock('base/common/schema/entities');

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
			url: Constants.app.DATABASE_URL,
			name: 'default',
			entities
		});
	});

	test('should create new connection with different name', async () => {
		await dBInstance.getSqlInstance('testing');
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'mysql',
			url: Constants.app.DATABASE_URL,
			name: 'testing',
			entities
		});
	});

	test('should add postgres and ssl for production env', async () => {
		(process.env as any).NODE_ENV = 'production';
		await dBInstance.getSqlInstance('testing');
		expect(typeorm.createConnection).toHaveBeenCalledWith({
			type: 'postgres',
			url: Constants.app.DATABASE_URL,
			name: 'testing',
			entities,
			extra: { ssl: { rejectUnauthorized: false } },
			ssl: true
		});
	});
});
