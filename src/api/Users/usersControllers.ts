import { Response } from 'express';
import { Constants } from '../../_shared/constants';
import { getResponseData } from '../../_shared/services/utilities';
import { IAuthUser, IRequest } from '../../_shared/types';
import { checkUsernameExists, updateUserProfile } from './dataService';

export const updateProfile = async (req: IRequest, res: Response) => {
	const { id }: IAuthUser = req.user;
	const data = Object.assign({}, req.body.data, { id });
	const user = await updateUserProfile(data);
	const responseData = getResponseData(user);
	res.status(Constants.status.SUCCESS).json(responseData);
};

export const checkUsername = async (req: IRequest, res: Response) => {
	const { username } = req.query!;
	const isExists = await checkUsernameExists(username as string);
	const responseData = getResponseData(isExists);
	res.status(Constants.status.SUCCESS).json(responseData);
};
