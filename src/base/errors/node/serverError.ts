import { Constants } from 'base/config/node/constants';
import { getErrorFactory } from 'base/errors/node/errorFactory';

export const getServerError = (message = 'An error occurred whilst processing request') => {
	return getErrorFactory(
		message,
		Constants.status.SERVER_ERROR,
		'ERR_INTERNAL_SERVER_ERROR',
		'Server Error'
	);
};
