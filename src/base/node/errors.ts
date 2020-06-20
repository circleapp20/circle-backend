import { processError } from 'base/common/errors';
import { Constants } from 'base/constants';
import { IError } from 'base/types';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (error: IError, _: Request, res: Response, __: NextFunction) => {
	const status = error.status || Constants.status.SERVER_ERROR;
	const responseData = processError(error);
	return res.status(status).json(responseData);
};
