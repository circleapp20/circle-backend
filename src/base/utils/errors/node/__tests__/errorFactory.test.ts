import { SERVER } from 'base/config/server';
import { getErrorFactory } from 'base/utils/errors/node/errorFactory';

describe('#getErrorFactory', () => {
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

	test('should return an object', () => {
		const error = getErrorFactory(
			'testing error factory',
			SERVER.status.BAD_REQUEST,
			'ERR_BAD_REQUEST'
		);
		const { stack, ...other } = error;
		expect(other).toEqual({
			message: 'testing error factory',
			status: SERVER.status.BAD_REQUEST,
			errCode: 'ERR_BAD_REQUEST',
			name: 'Error'
		});
	});

	test('should add a name to the object', () => {
		const error = getErrorFactory(
			'testing error factory',
			SERVER.status.BAD_REQUEST,
			'ERR_BAD_REQUEST',
			'Request error'
		);
		const { stack, ...other } = error;
		expect(other).toEqual({
			message: 'testing error factory',
			status: SERVER.status.BAD_REQUEST,
			errCode: 'ERR_BAD_REQUEST',
			name: 'Request error'
		});
	});

	test('should be throwable', () => {
		const mock = () => {
			throw getErrorFactory('test', SERVER.status.BAD_REQUEST, 'ERR_BAD_REQUEST');
		};
		expect(mock).toThrow(getErrorFactory('test', SERVER.status.BAD_REQUEST, 'ERR_BAD_REQUEST'));
	});

	test('should not add stack to object in production', () => {
		(process.env as any).NODE_ENV = 'production';
		const error = getErrorFactory(
			'testing error factory',
			SERVER.status.BAD_REQUEST,
			'ERR_BAD_REQUEST'
		);
		expect(error).not.toHaveProperty('stack');
	});
});
