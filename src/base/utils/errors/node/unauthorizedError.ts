import { SERVER } from 'base/config/server';
import { getErrorFactory } from 'base/utils/errors/node/errorFactory';

export const getUnauthorizedError = (message = 'Unauthorized access') => {
	return getErrorFactory(
		message,
		SERVER.status.UNAUTHORIZED,
		'ERR_UNAUTHORIZED_ACCESS',
		'Unauthorized Error'
	);
};
