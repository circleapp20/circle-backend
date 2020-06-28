import { apiPost } from 'base/apiService/common/apiAxiosPost';
import { Constants } from 'base/config/node/constants';
import { printToConsole } from 'base/utils/node/printToConsole';

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
