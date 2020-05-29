import { Response } from 'express';
import { Constants } from '../../_shared/constants';
import { getResponseData } from '../../_shared/services/utilities';
import { IAuthUser, IRequest } from '../../_shared/types';
import { updateUserProfile } from './dataService';

export const updateProfile = async (req: IRequest, res: Response) => {
	const { id }: IAuthUser = req.user;
	const data = Object.assign({}, req.body.data, { id });
	const user = await updateUserProfile(data);
	const responseData = getResponseData(user);
	res.status(Constants.status.SUCCESS).json(responseData);
};
