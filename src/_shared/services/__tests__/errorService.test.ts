import { Constants } from '../../constants';
import {
	errorMiddleware,
	getBadRequestError,
	getErrorFactory,
	getForbiddenError,
	getServerError
} from '../errorService';

beforeEach(() => jest.clearAllMocks());

describe('#errorService', () => {
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

	describe('#errorMiddleware', () => {
		const response: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};

		const req: any = {};
		const nextMock: any = jest.fn();

		test('should send a status of 500 as a response status', () => {
			const error = getServerError();
			errorMiddleware(error, req, response, nextMock);
			expect(response.status).toBeCalled();
			expect(response.status).toBeCalledWith(Constants.status.SERVER_ERROR);
		});

		test('should send status from error object', () => {
			const error = getServerError();
			errorMiddleware(error, req, response, nextMock);
			expect(response.status).toBeCalledWith(Constants.status.SERVER_ERROR);
		});

		test('should send a json response with the error object', () => {
			const error = getServerError();
			errorMiddleware(error, req, response, nextMock);
			expect(response.json).toBeCalled();
			expect(response.json).toBeCalledWith({
				data: {
					status: Constants.status.SERVER_ERROR,
					errCode: 'ERR_INTERNAL_SERVER_ERROR',
					message: error.message
				},
				success: false
			});
		});
	});

	describe('#getErrorFactory', () => {
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
			// @ts-ignore
			process.env.NODE_ENV = 'production';
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
});
