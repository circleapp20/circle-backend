import { SERVER } from 'base/config/server';
import { processServerError } from 'base/utils/errors/node/processServerError';

describe('#processServerError', () => {
	test('should return response object', () => {
		const obj = processServerError({
			errCode: 'ERR_BAD_REQUEST',
			message: 'bad request formatting',
			name: 'Bad Request Error',
			status: SERVER.status.BAD_REQUEST
		});
		expect(obj).toEqual({
			data: {
				status: SERVER.status.BAD_REQUEST,
				errCode: 'ERR_BAD_REQUEST',
				message: 'bad request formatting'
			},
			success: false
		});
	});

	test('should return internal server error if status & errCode not defined', () => {
		const obj = processServerError({
			message: 'bad request formatting',
			name: 'Bad Request Error'
		});
		expect(obj).toEqual({
			data: {
				status: SERVER.status.SERVER_ERROR,
				errCode: 'ERR_INTERNAL_SERVER_ERROR',
				message: 'bad request formatting'
			},
			success: false
		});
	});

	test('should return object for validation error', () => {
		const obj = processServerError({
			errCode: 'ERR_INTERNAL_SERVER_ERROR',
			message: 'bad request formatting',
			name: 'Bad Request Error',
			status: SERVER.status.SERVER_ERROR,
			error: { isJoi: true, message: 'name is required' }
		});
		expect(obj).toEqual({
			data: {
				status: SERVER.status.BAD_REQUEST,
				errCode: 'ERR_BAD_REQUEST',
				message: 'name is required'
			},
			success: false
		});
	});

	test('should add stack for non production env', () => {
		const obj = processServerError({
			errCode: 'ERR_FORBIDDEN_ACCESS',
			message: 'Forbidden Access',
			name: 'Forbidden Error',
			status: SERVER.status.FORBIDDEN,
			stack: 'this is a stack'
		});
		expect(obj).toEqual({
			data: {
				errCode: 'ERR_FORBIDDEN_ACCESS',
				message: 'Forbidden Access',
				status: SERVER.status.FORBIDDEN,
				stack: 'this is a stack'
			},
			success: false
		});
	});
});
