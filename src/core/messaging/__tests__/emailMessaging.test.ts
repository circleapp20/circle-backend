import { SERVER } from 'base/config/server';
import { getMailHeaders, getMailTransportInstance, sendMail } from 'core/messaging/emailMessaging';
import nodemailer from 'nodemailer';

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

beforeEach(() => jest.clearAllMocks());

describe('#getMailTransportInstance', () => {
	test('should create a new transporter with config', async () => {
		const mockFn = jest.spyOn(nodemailer, 'createTransport');
		await getMailTransportInstance();
		expect(mockFn).toHaveBeenCalled();
	});
});

describe('#getMailHeaders', () => {
	test('should return headers for email', () => {
		const headers = getMailHeaders({
			to: 'test@test.com',
			subject: 'Testing mail service',
			text: 'This is the body of the message'
		});
		expect(headers).toEqual({
			from: SERVER.accounts.EMAIL_ADDRESS,
			to: 'test@test.com',
			subject: 'Testing mail service',
			text: 'This is the body of the message'
		});
	});

	test('should add to address, subject to header', () => {
		const headers = getMailHeaders({
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			text: 'This is the body of the message'
		});
		expect(headers).toEqual({
			from: SERVER.accounts.EMAIL_ADDRESS,
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			text: 'This is the body of the message'
		});
	});

	test('should add html to mail header', () => {
		const headers = getMailHeaders({
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			html: '<b>Testing html</b>'
		});
		expect(headers).toEqual({
			from: SERVER.accounts.EMAIL_ADDRESS,
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			html: '<b>Testing html</b>'
		});
	});
});

describe('#sendMail', () => {
	const headers = getMailHeaders({
		to: 'recipient@gmail.com',
		subject: 'Testing services',
		html: '<b>Testing html</b>'
	});

	test('should return null if error occurs', async () => {
		const results = await sendMail(headers);
		expect(results).toBeNull();
	});

	test('should send mail with valid headers', (done) => {
		sendMail(headers).then((value) => {
			expect(value).toBeDefined();
			done();
		});
	});
});
