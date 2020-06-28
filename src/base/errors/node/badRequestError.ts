import { Constants } from 'base/config/node/constants';
import { getErrorFactory } from 'base/errors/node/errorFactory';

export const getBadRequestError = (message = 'Invalid request data') => {
	return getErrorFactory(
		message,
		Constants.status.BAD_REQUEST,
		'ERR_BAD_REQUEST',
		'Bad Request Error'
	);
};
