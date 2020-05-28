import { Request, Response } from 'express';
import { Constants } from '../../_shared/constants';
import { getResponseData } from '../../_shared/services/utilities';
import { IAuthUser } from '../../_shared/types';
import { updateUserProfile } from './dataService';

export const updateProfile = async (req: Request, res: Response) => {
	const authUser: IAuthUser = req.body.user;
	const data = Object.assign({}, req.body.data, { id: authUser.id });
	const user = await updateUserProfile(data);
	const responseData = getResponseData(user);
	res.status(Constants.status.SUCCESS).json(responseData);
};
