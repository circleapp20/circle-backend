import { NextFunction, Request, Response } from 'express';
import { IError } from '../types';

export class BaseError extends Error implements IError {
	constructor(
		public message = '',
		public status = 500,
		public errCode = 'ERR_INTERNAL_SERVER_ERROR'
	) {
		super();
	}
}

export class ForbiddenError extends BaseError {
	constructor() {
		super('Access forbidden', 403, 'ERR_FORBIDDEN_ACCESS');
	}
}

export class ServerError extends BaseError {
	constructor(message = 'An error occurred whilst processing request') {
		super(message, 500, 'ERR_INTERNAL_SERVER_ERROR');
	}
}

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
