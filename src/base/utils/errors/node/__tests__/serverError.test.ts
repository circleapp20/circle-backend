import { SERVER } from 'base/config/server';
import { getServerError } from 'base/utils/errors/node/serverError';

describe('#getServerError', () => {
	test('should have a status of 500', () => {
		const error = getServerError();
		expect(error.status).toBe(SERVER.status.SERVER_ERROR);
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
