import { SERVER } from 'base/config/server';
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
			user: SERVER.app.MAIL_USER,
			pass: SERVER.app.MAIL_PASSWORD,
			type: 'OAuth2',
			clientId: SERVER.app.GOOGLE_CLIENT_ID,
			clientSecret: SERVER.app.GOOGLE_CLIENT_SECRET,
			refreshToken: SERVER.app.GOOGLE_CLIENT_REFRESH_TOKEN,
			accessToken
		}
	};

	return nodemailer.createTransport(transportOptions);
};

export const getMailHeaders = (args: IRecipientMailConfig) => {
	return {
		...args,
		from: SERVER.accounts.EMAIL_ADDRESS
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
