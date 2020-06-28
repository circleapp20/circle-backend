import { Constants } from 'base/config/node/constants';
import { IRecipientMailConfig } from 'base/types';
import { getGoogleOAuth2AccessToken } from 'core/messaging/googleOAuth2';
import nodemailer from 'nodemailer';

export const getMailTransportInstance = async () => {
	const accessToken = await getGoogleOAuth2AccessToken();

	const transportOptions: any = {
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: Constants.app.MAIL_USER,
			pass: Constants.app.MAIL_PASSWORD,
			type: 'OAuth2',
			clientId: Constants.app.GOOGLE_CLIENT_ID,
			clientSecret: Constants.app.GOOGLE_CLIENT_SECRET,
			refreshToken: Constants.app.GOOGLE_CLIENT_REFRESH_TOKEN,
			accessToken
		}
	};

	return nodemailer.createTransport(transportOptions);
};

export const getMailHeaders = (args: IRecipientMailConfig) => {
	return {
		...args,
		from: Constants.accounts.EMAIL_ADDRESS
	};
};

export const sendMail = async (options: nodemailer.SendMailOptions) => {
	try {
		const transporter = await getMailTransportInstance();
		return transporter.sendMail(options);
	} catch (error) {
		return null;
	}
};
