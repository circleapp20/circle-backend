import { SERVER } from 'base/config/server';
import { getErrorFactory } from 'base/utils/errors/node/errorFactory';

export const getBadRequestError = (message = 'Invalid request data') => {
	return getErrorFactory(
		message,
		SERVER.status.BAD_REQUEST,
		'ERR_BAD_REQUEST',
		'Bad Request Error'
	);
};
