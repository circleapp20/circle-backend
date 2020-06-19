import nodemailer from 'nodemailer';
import { apiPost } from 'shared/common/apiActions';
import { printToConsole } from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import * as messaging from 'shared/node/messaging';

jest.mock('googleapis', () => ({
	google: {
		auth: {
			OAuth2: jest.fn(() => ({
				setCredentials: jest.fn(),
				getAccessToken: jest.fn(() => ({
					token: 'i&m9oim2930n2md2n'
				}))
			}))
		}
	}
}));
jest.mock('nodemailer');
jest.mock('shared/common/apiActions');
jest.mock('shared/common/utilities', () => ({
	printToConsole: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#getMailTransportInstance', () => {
	test('should create a new transporter with config', async () => {
		const mockFn = jest.spyOn(nodemailer, 'createTransport');
		await messaging.getMailTransportInstance();
		expect(mockFn).toHaveBeenCalled();
	});
});

describe('#getMailHeaders', () => {
	test('should return headers for email', () => {
		const headers = messaging.getMailHeaders({
			to: 'test@test.com',
			subject: 'Testing mail service',
			text: 'This is the body of the message'
		});
		expect(headers).toEqual({
			from: Constants.accounts.EMAIL_ADDRESS,
			to: 'test@test.com',
			subject: 'Testing mail service',
			text: 'This is the body of the message'
		});
	});

	test('should add to address, subject to header', () => {
		const headers = messaging.getMailHeaders({
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			text: 'This is the body of the message'
		});
		expect(headers).toEqual({
			from: Constants.accounts.EMAIL_ADDRESS,
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			text: 'This is the body of the message'
		});
	});

	test('should add html to mail header', () => {
		const headers = messaging.getMailHeaders({
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			html: '<b>Testing html</b>'
		});
		expect(headers).toEqual({
			from: Constants.accounts.EMAIL_ADDRESS,
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			html: '<b>Testing html</b>'
		});
	});
});

describe('#sendMail', () => {
	const headers = messaging.getMailHeaders({
		to: 'recipient@gmail.com',
		subject: 'Testing services',
		html: '<b>Testing html</b>'
	});

	test('should return null if error occurs', async () => {
		const results = await messaging.sendMail(headers);
		expect(results).toBeNull();
	});

	test('should send mail with valid headers', (done) => {
		messaging.sendMail(headers).then((value) => {
			expect(value).toBeDefined();
			done();
		});
	});
});

describe('#sendSMSWithMNotify', () => {
	test('should send post request to SMS service', async () => {
		await messaging.sendSMSWithMNotify(['+233248252444'], 'testing sms message');
		expect(apiPost).toHaveBeenCalledWith(
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
		await messaging.sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
		expect(apiPost).not.toHaveBeenCalled();
		expect(printToConsole).toHaveBeenCalledWith(expect.any(String));
	});

	test('should send message to number using mnotify in production', async () => {
		(process.env as any).NODE_ENV = 'production';
		await messaging.sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
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
		await messaging.sendSMSMessage({ message: 'testing message', to: '+2338489384848' });
		expect(printToConsole).toHaveBeenCalledWith(expect.any(Error));
	});
});
