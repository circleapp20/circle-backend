import { Constants } from '../constants';
import { apiPost } from './apiService';
import { printToConsole } from './utilities';

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
		printToConsole('SMS message: ' + message);
	} catch (error) {
		printToConsole(error);
	}
};
