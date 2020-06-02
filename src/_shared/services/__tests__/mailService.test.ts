import nodemailer from 'nodemailer';
import { Constants } from '../../constants';
import * as mailService from '../mailService';
import { sendMail } from '../mailService';

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

describe('#mailService', () => {
	describe('#getMailTransportInstance', () => {
		test('should create a new transporter with config', async () => {
			const mockFn = jest.spyOn(nodemailer, 'createTransport');
			await mailService.getMailTransportInstance();
			expect(mockFn).toHaveBeenCalledWith(
				expect.objectContaining({
					host: expect.stringMatching('smtp.gmail.com'),
					port: expect.any(Number),
					secure: expect.any(Boolean),
					auth: expect.objectContaining({
						user: expect.any(String),
						pass: expect.any(String),
						type: expect.stringMatching('OAuth2'),
						clientId: expect.any(String),
						clientSecret: expect.any(String),
						refreshToken: expect.any(String)
					})
				})
			);
		});
	});

	describe('#getMailHeaders', () => {
		test('should return headers for email', () => {
			const headers = mailService.getMailHeaders({
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
			const headers = mailService.getMailHeaders({
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
			const headers = mailService.getMailHeaders({
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
		const headers = mailService.getMailHeaders({
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
});
