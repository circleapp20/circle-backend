import { apiPost } from 'base/apiFunctions/apiPost';
import { SERVER } from 'base/config/server';
import { printToConsole } from 'base/utils/node/printToConsole';
import { sendSMSMessage, sendSMSWithMNotify } from 'core/messaging/smsMessaging';

jest.mock('base/apiFunctions/apiPost');
jest.mock('base/utils/node/printToConsole', () => ({
	printToConsole: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#sendSMSWithMNotify', () => {
	test('should send post request to SMS service', async () => {
		await sendSMSWithMNotify(['+233248252444'], 'testing sms message');
		expect(apiPost).toHaveBeenCalledWith(
			expect.stringContaining('/sms/quick?key='),
			expect.objectContaining({
				is_schedule: expect.any(Boolean),
				message: expect.stringMatching('testing sms message'),
				recipient: expect.arrayContaining(['+233248252444']),
				schedule_date: expect.any(String),
				sender: expect.stringMatching(SERVER.app.MNOTIFY_SENDER_ID)
			}),
			expect.stringMatching(SERVER.services.SMS)
		);
	});
});

describe('#sendSMSMessage', () => {
	// https://stackoverflow.com/questions/48033841/test-process-env-with-jest
	const OLD_ENV = process.env;

	afterEach(() => {
		process.env = OLD_ENV;
	});

	beforeEach(() => {
		jest.resetModules(); // this is important - it clears the cache
		process.env = { ...OLD_ENV };
		delete (process.env as any).NODE_ENV;
	});

	test('should print message to console in non production env', async () => {
		await sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
		expect(apiPost).not.toHaveBeenCalled();
		expect(printToConsole).toHaveBeenCalledWith(expect.any(String));
	});

	test('should send message to number using mnotify in production', async () => {
		(process.env as any).NODE_ENV = 'production';
		await sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
		expect(apiPost).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				recipient: expect.arrayContaining(['+2338489384848'])
			}),
			expect.any(String)
		);
	});

	test('should show error in the console when sending fails for production', async () => {
		(process.env as any).NODE_ENV = 'production';
		(apiPost as any).mockRejectedValueOnce(new Error());
		await sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
		expect(printToConsole).toHaveBeenCalledWith(expect.any(Error));
	});
});
