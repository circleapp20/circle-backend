import { Response } from 'express';
import {
	checkUsernameOrEmailExists,
	updateUserPassword,
	updateUserProfile
} from 'feature/users/node/dataService';
import { getResponseData } from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import { IAuthUser, IRequest } from 'shared/types';

export const updateProfile = async (req: IRequest, res: Response) => {
	const { id }: IAuthUser = req.user;
	const data = Object.assign({}, req.body.data, { id });
	const user = await updateUserProfile(data);
	const responseData = getResponseData(user);
	res.status(Constants.status.SUCCESS).json(responseData);
};

export const searchUsernameOrEmail = async (req: IRequest, res: Response) => {
	const { username = '', email = '' }: any = req.query!;
	const exists = await checkUsernameOrEmailExists(username, email);
	const responseData = getResponseData(exists);
	res.status(Constants.status.SUCCESS).json(responseData);
};

export const resetUserPassword = async (req: IRequest, res: Response) => {
	const { id } = req.user;
	const isUpdated = await updateUserPassword(id, req.body.data.password);
	const responseData = getResponseData(isUpdated);
	res.status(Constants.status.SUCCESS).json(responseData);
};
