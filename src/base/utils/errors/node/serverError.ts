import { SERVER } from 'base/config/server';
import { getErrorFactory } from 'base/utils/errors/node/errorFactory';

export const getServerError = (message = 'An error occurred whilst processing request') => {
	return getErrorFactory(
		message,
		SERVER.status.SERVER_ERROR,
		'ERR_INTERNAL_SERVER_ERROR',
		'Server Error'
	);
};
