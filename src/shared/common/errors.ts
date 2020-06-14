import { Constants } from '../constants';
import { IError } from '../types';
import { getResponseData } from './utilities';

export const getErrorFactory = (
	message: string,
	status: number,
	errCode: string,
	name?: string
) => {
	const error = new Error(message);
	const obj: IError = {
		message: error.message,
		status,
		errCode,
		name: name || error.name
	};
	if (process.env.NODE_ENV !== 'production') {
		obj.stack = error.stack;
	}
	return obj;
};

export const getForbiddenError = () => {
	return getErrorFactory(
		'Access forbidden',
		Constants.status.FORBIDDEN,
		'ERR_FORBIDDEN_ACCESS',
		'Forbidden Error'
	);
};

export const getServerError = (message = 'An error occurred whilst processing request') => {
	return getErrorFactory(
		message,
		Constants.status.SERVER_ERROR,
		'ERR_INTERNAL_SERVER_ERROR',
		'Server Error'
	);
};

export const getBadRequestError = (message = 'Invalid request data') => {
	return getErrorFactory(
		message,
		Constants.status.BAD_REQUEST,
		'ERR_BAD_REQUEST',
		'Bad Request Error'
	);
};

export const processError = (error: Partial<IError>) => {
	let {
		status = Constants.status.SERVER_ERROR,
		errCode = 'ERR_INTERNAL_SERVER_ERROR',
		message
	} = error;
	if (error.error && error.error.isJoi) {
		status = Constants.status.BAD_REQUEST;
		message = error.error.message;
		errCode = 'ERR_BAD_REQUEST';
	}
	let data = { status, errCode, message };
	if (process.env.NODE_ENV !== 'production') {
		const stack = error.stack;
		data = Object.assign({}, data, { stack });
	}
	return getResponseData(data, false);
};

export const getUnauthorizedError = (message = 'Unauthorized access') => {
	return getErrorFactory(
		message,
		Constants.status.UNAUTHORIZED,
		'ERR_UNAUTHORIZED_ACCESS',
		'Unauthorized Error'
	);
};