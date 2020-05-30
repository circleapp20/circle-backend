import * as Google from 'googleapis';
import nodemailer from 'nodemailer';
import { Constants } from '../constants';
import { IRecipientMaiConfig } from '../types';

export const getGoogleOAuth2AccessToken = () => {
	const client = new Google.google.auth.OAuth2(
		Constants.app.GOOGLE_CLIENT_ID,
		Constants.app.GOOGLE_CLIENT_SECRET,
		Constants.externals.OAUTH2_REDIRECT_URL
	);
	client.setCredentials({ refresh_token: Constants.app.GOOGLE_CLIENT_REFRESH_TOKEN });
	return client.getAccessToken();
};

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

export const getMailHeaders = (args: IRecipientMaiConfig) => {
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
