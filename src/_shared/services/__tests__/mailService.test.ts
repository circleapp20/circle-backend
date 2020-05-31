import nodemailer from 'nodemailer';
import { Constants } from '../../constants';
import * as mailService from '../mailService';
import { getMailHeaders, getMailTransportInstance, sendMail } from '../mailService';

jest.mock('googleapis');

beforeEach(() => jest.resetAllMocks());

describe('#mailService', () => {
	describe('#getMailTransportInstance', () => {
		let getAccessTokenMock;

		beforeEach(() => {
			getAccessTokenMock = jest.spyOn(mailService, 'getGoogleOAuth2AccessToken');
			getAccessTokenMock.mockImplementation(jest.fn()).mockResolvedValue({} as any);
		});

		test('should create a new transporter with config', async () => {
			const mockFn = jest.spyOn(nodemailer, 'createTransport');
			await getMailTransportInstance();
			expect(mockFn).toHaveBeenCalledWith({
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
					accessToken: {}
				}
			});
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
				from: Constants.accounts.EMAIL_ADDRESS,
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
				from: Constants.accounts.EMAIL_ADDRESS,
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
				from: Constants.accounts.EMAIL_ADDRESS,
				to: 'recipient@gmail.com',
				subject: 'Testing services',
				html: '<b>Testing html</b>'
			});
		});
	});

	describe('#sendMail', () => {
		let instanceMock: jest.SpyInstance<Promise<any>, []>;
		const sendMailMock = jest.fn();

		beforeEach(() => {
			instanceMock = jest.spyOn(mailService, 'getMailTransportInstance');
			instanceMock.mockImplementation().mockResolvedValue({ sendMail: sendMailMock });
		});

		const headers = getMailHeaders({
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			html: '<b>Testing html</b>'
		});

		test('should send mail with valid headers', async () => {
			await sendMail(headers);
			expect(instanceMock).toHaveBeenCalled();
			expect(sendMailMock).toHaveBeenCalledWith(
				expect.objectContaining({
					to: expect.any(String),
					subject: expect.any(String),
					from: expect.stringMatching(Constants.accounts.EMAIL_ADDRESS),
					html: expect.any(String)
				})
			);
		});

		test('should not send mail if error occurs', async () => {
			sendMailMock.mockRejectedValueOnce(new Error());
			instanceMock.mockResolvedValueOnce({ sendMail: sendMailMock });
			const wrapper = () => sendMail(headers);
			expect(wrapper).rejects.toThrow();
		});

		test('should return null if error occurs', async () => {
			instanceMock.mockResolvedValueOnce({
				sendMail: jest.fn().mockImplementationOnce(() => {
					throw new Error();
				})
			} as any);
			const results = await sendMail(headers);
			expect(results).toBeNull();
		});
	});
});
