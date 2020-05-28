import { Request, Response } from 'express';
import { getResponseData } from '../../_shared/services/utilities';
import { updateUserProfile } from './dataService';

export const updateProfile = async (req: Request, res: Response) => {
	const user = await updateUserProfile(req.body.data);
	const responseData = getResponseData(user);
	res.status(200).json(responseData);
};
