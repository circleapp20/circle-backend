import {
	getBadRequestError,
	getErrorFactory,
	getForbiddenError,
	getServerError,
	getUnauthorizedError,
	processError
} from 'base/common/errors';
import { Constants } from 'base/constants';

beforeEach(() => jest.clearAllMocks());

describe('#getServerError', () => {
	test('should have a status of 500', () => {
		const error = getServerError();
		expect(error.status).toBe(Constants.status.SERVER_ERROR);
	});

	test('should have an errCode of ERR_INTERNAL_SERVER_ERROR', () => {
		const error = getServerError();
		expect(error.errCode).toBe('ERR_INTERNAL_SERVER_ERROR');
	});

	test('should have a message', () => {
		const error = getServerError();
		expect(error.message).toBe('An error occurred whilst processing request');
	});

	test('should have the message from the constructor', () => {
		const error = getServerError('Testing message');
		expect(error.message).toBe('Testing message');
	});
});

describe('#getForbiddenError', () => {
	test('should have a status of 403', () => {
		const error = getForbiddenError();
		expect(error.status).toBe(Constants.status.FORBIDDEN);
	});

	test('should have an errCode of ERR_FORBIDDEN_ACCESS', () => {
		const error = getForbiddenError();
		expect(error.errCode).toBe('ERR_FORBIDDEN_ACCESS');
	});

	test('should have a message', () => {
		const error = getForbiddenError();
		expect(error.message).toBe('Access forbidden');
	});
});

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
			Constants.status.BAD_REQUEST,
			'ERR_BAD_REQUEST'
		);
		const { stack, ...other } = error;
		expect(other).toEqual({
			message: 'testing error factory',
			status: Constants.status.BAD_REQUEST,
			errCode: 'ERR_BAD_REQUEST',
			name: 'Error'
		});
	});

	test('should add a name to the object', () => {
		const error = getErrorFactory(
			'testing error factory',
			Constants.status.BAD_REQUEST,
			'ERR_BAD_REQUEST',
			'Request error'
		);
		const { stack, ...other } = error;
		expect(other).toEqual({
			message: 'testing error factory',
			status: Constants.status.BAD_REQUEST,
			errCode: 'ERR_BAD_REQUEST',
			name: 'Request error'
		});
	});

	test('should be throwable', () => {
		const mock = () => {
			throw getErrorFactory('test', Constants.status.BAD_REQUEST, 'ERR_BAD_REQUEST');
		};
		expect(mock).toThrow(
			getErrorFactory('test', Constants.status.BAD_REQUEST, 'ERR_BAD_REQUEST')
		);
	});

	test('should not add stack to object in production', () => {
		(process.env as any).NODE_ENV = 'production';
		const error = getErrorFactory(
			'testing error factory',
			Constants.status.BAD_REQUEST,
			'ERR_BAD_REQUEST'
		);
		expect(error).not.toHaveProperty('stack');
	});
});

describe('#getBadRequestError', () => {
	test('should have a status of 400', () => {
		const error = getBadRequestError();
		expect(error.status).toBe(Constants.status.BAD_REQUEST);
	});

	test('should have an errCode of ERR_BAD_REQUEST', () => {
		const error = getBadRequestError();
		expect(error.errCode).toBe('ERR_BAD_REQUEST');
	});

	test('should have a default message', () => {
		const error = getBadRequestError();
		expect(error.message).toBe('Invalid request data');
	});

	test('should have a name of Bad Request Error', () => {
		const error = getBadRequestError();
		expect(error.name).toBe('Bad Request Error');
	});
});

describe('#getUnauthorizedError', () => {
	test('should have status of 401', () => {
		const error = getUnauthorizedError();
		expect(error.status).toBe(Constants.status.UNAUTHORIZED);
	});

	test('should have an errCode of ERR_UNAUTHORIZED_ACCESS', () => {
		const error = getUnauthorizedError();
		expect(error.errCode).toBe('ERR_UNAUTHORIZED_ACCESS');
	});

	test('should have a default message', () => {
		const error = getUnauthorizedError();
		expect(error.message).toBe('Unauthorized access');
	});

	test('should have a name of Unauthorized Error', () => {
		const error = getUnauthorizedError();
		expect(error.name).toBe('Unauthorized Error');
	});

	test('should set message from param', () => {
		const error = getUnauthorizedError('testing unauthorized');
		expect(error.message).toBe('testing unauthorized');
	});
});

describe('#processError', () => {
	test('should return response object', () => {
		const obj = processError({
			errCode: 'ERR_BAD_REQUEST',
			message: 'bad request formatting',
			name: 'Bad Request Error',
			status: Constants.status.BAD_REQUEST
		});
		expect(obj).toEqual({
			data: {
				status: Constants.status.BAD_REQUEST,
				errCode: 'ERR_BAD_REQUEST',
				message: 'bad request formatting'
			},
			success: false
		});
	});

	test('should return internal server error if status & errCode not defined', () => {
		const obj = processError({
			message: 'bad request formatting',
			name: 'Bad Request Error'
		});
		expect(obj).toEqual({
			data: {
				status: Constants.status.SERVER_ERROR,
				errCode: 'ERR_INTERNAL_SERVER_ERROR',
				message: 'bad request formatting'
			},
			success: false
		});
	});

	test('should return object for validation error', () => {
		const obj = processError({
			errCode: 'ERR_INTERNAL_SERVER_ERROR',
			message: 'bad request formatting',
			name: 'Bad Request Error',
			status: Constants.status.SERVER_ERROR,
			error: { isJoi: true, message: 'name is required' }
		});
		expect(obj).toEqual({
			data: {
				status: Constants.status.BAD_REQUEST,
				errCode: 'ERR_BAD_REQUEST',
				message: 'name is required'
			},
			success: false
		});
	});

	test('should add stack for non production env', () => {
		const obj = processError({
			errCode: 'ERR_FORBIDDEN_ACCESS',
			message: 'Forbidden Access',
			name: 'Forbidden Error',
			status: Constants.status.FORBIDDEN,
			stack: 'this is a stack'
		});
		expect(obj).toEqual({
			data: {
				errCode: 'ERR_FORBIDDEN_ACCESS',
				message: 'Forbidden Access',
				status: Constants.status.FORBIDDEN,
				stack: 'this is a stack'
			},
			success: false
		});
	});
});
