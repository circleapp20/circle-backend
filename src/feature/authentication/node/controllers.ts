import { Response } from 'express';
import {
	checkUserVerificationCode,
	createUserProfileWithDefaultValues,
	getUserAccountWithCredentials,
	getUserProfileById,
	verifyUserLoginCredentials
} from 'feature/authentication/node/dataService';
import { sendVerificationCodeByMedia } from 'feature/authentication/node/messaging';
import { getResponseData } from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import { IAuthUser, IRequest } from 'shared/types';

export const verifyUserCredentials = async (req: IRequest, res: Response) => {
	const user = await createUserProfileWithDefaultValues(req.body.data);

	sendVerificationCodeByMedia({
		media: user.email ? 'email' : 'phoneNumber',
		verificationCode: user.verificationCode,
		email: user.email,
		phoneNumber: user.phoneNumber
	});

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
	const { media }: any = req.query;
	const user = await getUserProfileById(req.user.id);

	sendVerificationCodeByMedia({
		media: media ? media : user.email ? 'email' : 'phoneNumber',
		verificationCode: user.verificationCode,
		email: user.email,
		phoneNumber: user.phoneNumber
	});

	const responseData = getResponseData(true);
	res.status(Constants.status.CREATED).json(responseData);
};

/**
 * the controller verifies the user's credentials in the database
 * and sends the verification code to the user by email or password
 * should the user have both email and password, a response of message
 * is return to the user to request which media to send the verification
 * code to either email or phone number
 */
export const verifyUserCredentialsForPasswordReset = async (req: IRequest, res: Response) => {
	const profile = await getUserAccountWithCredentials(req.body.data);

	const { email, verificationCode, phoneNumber } = profile;
	let message = 'Verification code cannot be sent. User has both email and phone number';

	sendVerificationCodeByMedia({
		media: phoneNumber ? 'phoneNumber' : 'email',
		verificationCode,
		email: email && !phoneNumber ? email : '',
		phoneNumber: !email && phoneNumber ? phoneNumber : ''
	});

	if (email && !phoneNumber) {
		message = "Verification code sent to user's email";
	} else if (!email && phoneNumber) {
		message = "Verification code sent to user's phone number";
	}

	const responseData = getResponseData({ user: profile, message });
	res.status(Constants.status.CREATED).json(responseData);
};
