import { NextFunction, Request, Response } from 'express';
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
	return getErrorFactory('Access forbidden', 403, 'ERR_FORBIDDEN_ACCESS', 'Forbidden Error');
};

export const getServerError = (message = 'An error occurred whilst processing request') => {
	return getErrorFactory(message, 500, 'ERR_INTERNAL_SERVER_ERROR', 'Server Error');
};

export const getBadRequestError = (message = 'Invalid request data') => {
	return getErrorFactory(message, 400, 'ERR_BAD_REQUEST', 'Bad Request Error');
};

export const errorMiddleware = (error: IError, _: Request, res: Response, __: NextFunction) => {
	const status = error.status || 500;
	const responseData = getResponseData(
		{ status, errCode: error.errCode || 'ERR_INTERNAL_SERVER_ERROR', message: error.message },
		false
	);
	return res.status(status).json(responseData);
};
