import nodemailer from 'nodemailer';
import { Constants } from '../../constants';
import * as mailService from '../mailService';
import { getMailHeaders, getMailTransportInstance, sendMail } from '../mailService';

beforeEach(() => jest.resetAllMocks());
// afterEach(() => jest.resetAllMocks())

describe('#mailService', () => {
	describe('#getMailTransportInstance', () => {
		test('should create a new transporter with config', () => {
			const mockFn = jest.spyOn(nodemailer, 'createTransport');
			getMailTransportInstance();
			expect(mockFn).toHaveBeenCalledWith({
				service: Constants.app.MAIL_SERVICE,
				auth: {
					user: Constants.app.MAIL_USER,
					pass: Constants.app.MAIL_PASSWORD
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
		const headers = getMailHeaders({
			to: 'recipient@gmail.com',
			subject: 'Testing services',
			html: '<b>Testing html</b>'
		});
		const sendMailMock = jest.fn();

		test('should send mail with valid headers', async () => {
			const mockFn = jest.spyOn(mailService, 'getMailTransportInstance');
			mockFn.mockReturnValue({ sendMail: sendMailMock } as any);
			await sendMail(headers);
			expect(mockFn).toHaveBeenCalled();
			expect(sendMailMock).toHaveBeenCalledWith(headers);
		});

		test('should not send mail if error occurs', async () => {
			sendMailMock.mockRejectedValueOnce(new Error());
			const mockFn = jest.spyOn(mailService, 'getMailTransportInstance');
			mockFn.mockReturnValue({ sendMail: sendMailMock } as any);
			const wrapper = () => sendMail(headers);
			expect(wrapper).rejects.toThrow();
		});

		test('should return null if error occurs', async () => {
			const mockFn = jest.spyOn(mailService, 'getMailTransportInstance');
			mockFn.mockReturnValue({
				sendMail: jest.fn().mockImplementationOnce(() => {
					throw new Error();
				})
			} as any);
			const results = await sendMail(headers);
			expect(results).toBeNull();
		});
	});
});
