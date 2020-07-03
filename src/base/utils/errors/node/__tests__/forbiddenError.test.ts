import { SERVER } from 'base/config/server';
import { getForbiddenError } from 'base/utils/errors/node/forbiddenError';

describe('#getForbiddenError', () => {
	test('should have a status of 403', () => {
		const error = getForbiddenError();
		expect(error.status).toBe(SERVER.status.FORBIDDEN);
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
