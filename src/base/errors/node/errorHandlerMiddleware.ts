import { Constants } from 'base/config/node/constants';
import { processServerError } from 'base/errors/node/processServerError';
import { IError } from 'base/types';
import { NextFunction, Request, Response } from 'express';

export const errorHandlerMiddleware = (
	error: IError,
	_: Request,
	res: Response,
	__: NextFunction
) => {
	const status = error.status || Constants.status.SERVER_ERROR;
	const responseData = processServerError(error);
	return res.status(status).json(responseData);
};
