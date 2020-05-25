import { NextFunction, Request, Response } from 'express';
import { IError } from '../types';

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
	return getErrorFactory('Access forbidden', 403, 'ERR_FORBIDDEN_ACCESS');
};

export const getServerError = (message = 'An error occurred whilst processing request') => {
	return getErrorFactory(message, 500, 'ERR_INTERNAL_SERVER_ERROR');
};

export const errorMiddleware = (error: IError, _: Request, res: Response, __: NextFunction) => {
	const status = error.status || 500;
	return res.status(status).json({
		data: {
			status,
			errCode: error.errCode || 'ERR_INTERNAL_SERVER_ERROR',
			message: error.message
		},
		success: false
	});
};
