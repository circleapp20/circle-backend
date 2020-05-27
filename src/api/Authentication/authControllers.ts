import { Request, Response } from 'express';
import { getResponseData } from '../../_shared/services/utilities';
import { sendVerificationCodeByEmail } from './authService';
import { checkUserVerificationCode, createUserProfileWithDefaultValues } from './dataService';

export const verifyUserCredentials = async (req: Request, res: Response) => {
	const user = await createUserProfileWithDefaultValues(req.body.data);

	// send email
	if (user && req.body.data.email) {
		sendVerificationCodeByEmail(user.verificationCode, user.email);
	}

	const responseData = getResponseData(user);
	res.status(201).json(responseData);
};

export const verifyUserVerificationCode = async (req: Request, res: Response) => {
	const status = await checkUserVerificationCode(req.body.data);
	const responseData = getResponseData(status);
	res.status(201).json(responseData);
};
