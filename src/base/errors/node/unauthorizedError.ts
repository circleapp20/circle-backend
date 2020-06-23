import { Constants } from 'base/config/node/constants';
import { getErrorFactory } from 'base/errors/node/errorFactory';

export const getUnauthorizedError = (message = 'Unauthorized access') => {
	return getErrorFactory(
		message,
		Constants.status.UNAUTHORIZED,
		'ERR_UNAUTHORIZED_ACCESS',
		'Unauthorized Error'
	);
};
