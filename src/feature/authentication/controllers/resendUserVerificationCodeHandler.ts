import { getResponseData } from 'base/common/utilities';
import { Constants } from 'base/constants';
import { IRequest } from 'base/types';
import { Response } from 'express';
import { sendVerificationCodeByMedia } from '../messaging/sendVerificationCode';
import { getUserProfileById } from '../services/node/getUsersProfileService';

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
