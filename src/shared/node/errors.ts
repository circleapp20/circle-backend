import { NextFunction, Request, Response } from 'express';
import { processError } from 'shared/common/errors';
import { Constants } from 'shared/constants';
import { IError } from 'shared/types';

export const errorMiddleware = (error: IError, _: Request, res: Response, __: NextFunction) => {
	const status = error.status || Constants.status.SERVER_ERROR;
	const responseData = processError(error);
	return res.status(status).json(responseData);
};
