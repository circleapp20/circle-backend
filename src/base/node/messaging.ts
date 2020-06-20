import { apiPost } from 'base/common/apiActions';
import { printToConsole } from 'base/common/utilities';
import { Constants } from 'base/constants';
import { IRecipientMailConfig } from 'base/types';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

export const sendSMSWithMNotify = async (to: string[], message: string) => {
	const data = {
		is_schedule: false,
		message,
		recipient: to,
		schedule_date: '',
		sender: Constants.app.MNOTIFY_SENDER_ID
	};
	const url = `/sms/quick?key=${Constants.app.MNOTIFY_API_KEY}`;
	const res = await apiPost(url, data, Constants.services.SMS);
	return res;
};

export const sendSMSMessage = async (args: { message: string; to: string }) => {
	try {
		const { message, to } = args;
		if (process.env.NODE_ENV === 'production') {
			await sendSMSWithMNotify([to], message);
		}
		printToConsole(message);
	} catch (error) {
		printToConsole(error);
	}
};

export const getGoogleOAuth2AccessToken = () => {
	const client = new google.auth.OAuth2(
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
