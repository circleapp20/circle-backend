import { getResponseData } from 'base/common/utilities';
import { Constants } from 'base/constants';
import { IRequest } from 'base/types';
import { Response } from 'express';
import { checkUsernameOrEmailExists } from '../services/node/checkUserExistsService';

export const searchUsernameOrEmail = async (req: IRequest, res: Response) => {
	const { username = '', email = '' }: any = req.query!;
	const exists = await checkUsernameOrEmailExists(username, email);
	const responseData = getResponseData(exists);
	res.status(Constants.status.SUCCESS).json(responseData);
};
