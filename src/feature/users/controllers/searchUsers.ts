import { Constants } from 'base/config/node/constants';
import { IRequest } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';
import { Response } from 'express';
import { checkUsernameOrEmailExists } from 'feature/users/services/node/checkUserExistsService';

export const searchUsernameOrEmail = async (req: IRequest, res: Response) => {
	const { username = '', email = '' }: any = req.query!;
	const exists = await checkUsernameOrEmailExists(username, email);
	const responseData = getResponseData(exists);
	res.status(Constants.status.SUCCESS).json(responseData);
};
