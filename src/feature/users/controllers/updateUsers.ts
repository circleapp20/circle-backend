import { SERVER } from 'base/config/server';
import { IRequest } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';
import { Response } from 'express';
import {
	updateUserPassword,
	updateUserProfile
} from 'feature/users/services/node/updateUserProfileService';

export const updateProfile = async (req: IRequest, res: Response) => {
	const { id } = req.user;
	const data = Object.assign({}, req.body.data, { id });
	const user = await updateUserProfile(data);
	const responseData = getResponseData(user);
	res.status(SERVER.status.SUCCESS).json(responseData);
};

export const resetUserPassword = async (req: IRequest, res: Response) => {
	const { id } = req.user;
	const isUpdated = await updateUserPassword(id, req.body.data.password);
	const responseData = getResponseData(isUpdated);
	res.status(SERVER.status.SUCCESS).json(responseData);
};
