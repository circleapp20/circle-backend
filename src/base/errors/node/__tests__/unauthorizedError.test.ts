import { Constants } from 'base/config/node/constants';
import { getUnauthorizedError } from 'base/errors/node/unauthorizedError';

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
