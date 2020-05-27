import nodemailer from 'nodemailer';
import { Constants } from '../constants';
import { IRecipientMaiConfig } from '../types';

export const getMailTransportInstance = () => {
	return nodemailer.createTransport({
		service: Constants.app.MAIL_SERVICE,
		auth: {
			user: Constants.app.MAIL_USER,
			pass: Constants.app.MAIL_PASSWORD
		}
	});
};

export const getMailHeaders = (args: IRecipientMaiConfig) => {
	return {
		...args,
		from: Constants.accounts.EMAIL_ADDRESS
	};
};

export const sendMail = async (options: nodemailer.SendMailOptions) => {
	try {
		const transporter = getMailTransportInstance();
		return transporter.sendMail(options);
	} catch (error) {
		return null;
	}
};
