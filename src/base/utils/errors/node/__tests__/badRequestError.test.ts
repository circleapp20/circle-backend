import { SERVER } from 'base/config/server';
import { getBadRequestError } from 'base/utils/errors/node/badRequestError';

describe('#getBadRequestError', () => {
	test('should have a status of 400', () => {
		const error = getBadRequestError();
		expect(error.status).toBe(SERVER.status.BAD_REQUEST);
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
