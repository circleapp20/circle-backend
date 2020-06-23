import { Constants } from 'base/config/node/constants';
import { getBadRequestError } from 'base/errors/node/badRequestError';

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
