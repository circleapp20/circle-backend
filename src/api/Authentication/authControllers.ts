import { Request, Response } from 'express';
import { getResponseData } from '../../_shared/services/utilities';
import { sendVerificationCodeByEmail } from './authService';
import { createUserProfileWithDefaultValues } from './dataService';

export const verifyUserCredentials = async (req: Request, res: Response) => {
	const user = await createUserProfileWithDefaultValues(req.body.data);

	// send email
	if (user && req.body.data.email) {
		sendVerificationCodeByEmail(user.verificationCode, user.email);
	}

	const responseData = getResponseData(user);
	res.status(201).json(responseData);
};
