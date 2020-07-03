import { SERVER } from 'base/config/server';
import { IError } from 'base/types';
import { processServerError } from 'base/utils/errors/node/processServerError';
import { NextFunction, Request, Response } from 'express';

export const errorHandlerMiddleware = (
	error: IError,
	_: Request,
	res: Response,
	__: NextFunction
) => {
	const status = error.status || SERVER.status.SERVER_ERROR;
	const responseData = processServerError(error);
	return res.status(status).json(responseData);
};
