import { Constants } from 'base/config/node/constants';
import { IRequest } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';
import { Response } from 'express';
import { sendVerificationCodeByMedia } from 'feature/authentication/messaging/sendVerificationCode';
import { getUserProfileById } from 'feature/authentication/services/node/getUsersProfileService';

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
