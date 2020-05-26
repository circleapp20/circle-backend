import { Request, Response } from 'express';
import { getResponseData } from '../../_shared/services/utilities';
import { createUserProfileWithDefaultValues } from './dataService';

export const verifyUserCredentials = async (req: Request, res: Response) => {
	const user = await createUserProfileWithDefaultValues(req.body.data);
	const responseData = getResponseData(user);
	res.status(201).json(responseData);
};
