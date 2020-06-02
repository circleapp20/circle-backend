import { Response } from 'express';
import { Constants } from '../../_shared/constants';
import { getResponseData } from '../../_shared/services/utilities';
import { IAuthUser, IRequest } from '../../_shared/types';
import { sendVerificationCodeByEmail, sendVerificationCodeBySMS } from './authService';
import {
	checkUserVerificationCode,
	createUserProfileWithDefaultValues,
	getUserProfileById,
	verifyUserLoginCredentials
} from './dataService';

export const verifyUserCredentials = async (req: IRequest, res: Response) => {
	const user = await createUserProfileWithDefaultValues(req.body.data);

	// send email
	if (user && req.body.data.email) {
		sendVerificationCodeByEmail(user.verificationCode, user.email);
	}

	if (user && req.body.data.phoneNumber) {
		sendVerificationCodeBySMS(user.verificationCode, user.phoneNumber);
	}

	const responseData = getResponseData(user);
	res.status(Constants.status.CREATED).json(responseData);
};

export const verifyUserVerificationCode = async (req: IRequest, res: Response) => {
	const { id }: IAuthUser = req.user;
	const data = Object.assign({}, req.body.data, { id });
	const status = await checkUserVerificationCode(data);
	const responseData = getResponseData(status);
	res.status(Constants.status.CREATED).json(responseData);
};

export const verifyUserLogin = async (req: IRequest, res: Response) => {
	const user = await verifyUserLoginCredentials(req.body.data);
	const responseData = getResponseData(user);
	res.status(Constants.status.CREATED).json(responseData);
};

export const resendUserVerificationCode = async (req: IRequest, res: Response) => {
	const user = await getUserProfileById(req.user.id);

	// resend verification code to user email
	if (user && user.email) {
		sendVerificationCodeByEmail(user.verificationCode, user.email);
	}

	if (user && user.phoneNumber) {
		sendVerificationCodeBySMS(user.verificationCode, user.phoneNumber);
	}

	const responseData = getResponseData(true);
	res.status(Constants.status.CREATED).json(responseData);
};
