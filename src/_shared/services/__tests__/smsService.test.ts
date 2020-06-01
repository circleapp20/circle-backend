import { Constants } from '../../constants';
import * as apiService from '../apiService';
import * as smsService from '../smsService';
import { sendSMSMessage, sendSMSWithMNotify } from '../smsService';
import * as utilities from '../utilities';

beforeEach(() => jest.clearAllMocks());

describe('#smsService', () => {
	describe('#sendSMSWithMNotify', () => {
		test('should send post request to SMS service', async () => {
			const postMock = jest.spyOn(apiService, 'apiPost');
			postMock.mockImplementationOnce(jest.fn());
			await sendSMSWithMNotify(['+233248252444'], 'testing sms message');
			expect(postMock).toHaveBeenCalledWith(
				expect.stringContaining('/sms/quick?key='),
				expect.objectContaining({
					is_schedule: expect.any(Boolean),
					message: expect.stringMatching('testing sms message'),
					recipient: expect.arrayContaining(['+233248252444']),
					schedule_date: expect.any(String),
					sender: expect.stringMatching(Constants.app.MNOTIFY_SENDER_ID)
				}),
				expect.stringMatching(Constants.services.SMS)
			);
		});
	});

	describe('#sendSMSMessage', () => {
		let printMock: jest.SpyInstance<void, [any]>;
		let sendMock: jest.SpyInstance<Promise<any>, [string[], string]>;

		// https://stackoverflow.com/questions/48033841/test-process-env-with-jest
		const OLD_ENV = process.env;

		afterEach(() => {
			process.env = OLD_ENV;
		});

		beforeEach(() => {
			jest.resetModules(); // this is important - it clears the cache
			process.env = { ...OLD_ENV };
			delete (process.env as any).NODE_ENV;

			printMock = jest.spyOn(utilities, 'printToConsole');
			printMock.mockImplementation(jest.fn());

			sendMock = jest.spyOn(smsService, 'sendSMSWithMNotify');
			sendMock.mockImplementation(jest.fn());
		});

		test('should send message to number', async () => {
			await sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
			expect(printMock).toHaveBeenCalledWith('SMS message: ' + 'testing message');
			expect(sendMock).not.toHaveBeenCalled();
		});

		test('should send message to number using mnotify in production', async () => {
			(process.env as any).NODE_ENV = 'production';
			await sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
			expect(sendMock).toHaveBeenCalledWith(
				expect.arrayContaining(['+2338489384848']),
				expect.stringMatching('testing message')
			);
		});

		test('should show error in the console when sending fails for production', async () => {
			(process.env as any).NODE_ENV = 'production';
			sendMock.mockRejectedValueOnce(new Error());
			await sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
			expect(sendMock).toHaveBeenCalled();
			expect(printMock).toHaveBeenCalledWith(expect.any(Error));
		});
	});
});
