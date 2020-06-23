import { Constants } from 'base/config/node/constants';
import { getErrorFactory } from 'base/errors/node/errorFactory';

export const getForbiddenError = () => {
	return getErrorFactory(
		'Access forbidden',
		Constants.status.FORBIDDEN,
		'ERR_FORBIDDEN_ACCESS',
		'Forbidden Error'
	);
};
