import { Request, Response } from 'express';
import { Constants } from '../../_shared/constants';
import { getResponseData } from '../../_shared/services/utilities';
import { IAuthUser } from '../../_shared/types';
import { sendVerificationCodeByEmail } from './authService';
import { checkUserVerificationCode, createUserProfileWithDefaultValues } from './dataService';

export const verifyUserCredentials = async (req: Request, res: Response) => {
	const user = await createUserProfileWithDefaultValues(req.body.data);

	// send email
	if (user && req.body.data.email) {
		sendVerificationCodeByEmail(user.verificationCode, user.email);
	}

	const responseData = getResponseData(user);
	res.status(Constants.status.CREATED).json(responseData);
};

export const verifyUserVerificationCode = async (req: Request, res: Response) => {
	const authUser: IAuthUser = req.body.user;
	const data = Object.assign({}, req.body.data, { id: authUser.id });
	const status = await checkUserVerificationCode(data);
	const responseData = getResponseData(status);
	res.status(Constants.status.CREATED).json(responseData);
};
