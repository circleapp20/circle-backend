import { SERVER } from 'base/config/server';
import { getErrorFactory } from 'base/utils/errors/node/errorFactory';

export const getForbiddenError = () => {
	return getErrorFactory(
		'Access forbidden',
		SERVER.status.FORBIDDEN,
		'ERR_FORBIDDEN_ACCESS',
		'Forbidden Error'
	);
};
