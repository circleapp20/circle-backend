import { Constants } from '../../../_shared/constants';
import * as mailService from '../../../_shared/services/mailService';
import * as smsService from '../../../_shared/services/smsService';
import {
	getVerificationEmailText,
	sendVerificationCodeByEmail,
	sendVerificationCodeByMedia,
	sendVerificationCodeBySMS
} from '../authService';
import { VERIFICATION_CODE_EMAIL_TEMPLATE } from '../_helpers/templates';

jest.mock('../../../_shared/services/schemaService');

describe('#authService', () => {
	let sendSMSMock: jest.SpyInstance;
	let sendMailMock: jest.SpyInstance;

	beforeAll(() => {
		sendSMSMock = jest.spyOn(smsService, 'sendSMSMessage');
		sendSMSMock.mockImplementation(jest.fn()).mockReturnValue({
			catch: jest.fn()
		});

		sendMailMock = jest.spyOn(mailService, 'sendMail');
		sendMailMock.mockImplementation(jest.fn()).mockReturnValue({
			catch: jest.fn()
		});
	});

	beforeEach(() => jest.clearAllMocks());

	describe('#getVerificationEmailText', () => {
		test('should generate a verification text', () => {
			const text = getVerificationEmailText('fu83m');
			const formattedText = VERIFICATION_CODE_EMAIL_TEMPLATE.replace(
				'{verificationCode}',
				'fu83m'
			).replace('{user}', 'User');
			expect(text).toBe(formattedText);
		});

		test('should replace the user', () => {
			const text = getVerificationEmailText('fu83m', 'Peter');
			const formattedText = VERIFICATION_CODE_EMAIL_TEMPLATE.replace(
				'{verificationCode}',
				'fu83m'
			).replace('{user}', 'Peter');
			expect(text).toBe(formattedText);
		});
	});

	describe('#sendVerificationCodeByEmail', () => {
		test('should not send email if email param is empty', () => {
			sendVerificationCodeByEmail('fu83m', '');
			expect(sendMailMock).not.toHaveBeenCalled();
		});

		test('should send email with verification code', () => {
			sendVerificationCodeByEmail('fu83m', 'test@test.com');
			expect(sendMailMock).toHaveBeenCalledWith(
				expect.objectContaining({
					from: Constants.accounts.EMAIL_ADDRESS,
					html: expect.any(String),
					subject: expect.stringMatching('Circle Verification Code'),
					to: expect.stringMatching('test@test.com')
				})
			);
		});
	});

	describe('#sendVerificationCodeBySMS', () => {
		test('should not send sms message with no phone number', () => {
			sendVerificationCodeBySMS('i39e', '');
			expect(sendSMSMock).not.toHaveBeenCalled();
		});

		test('should send verification message to phone number', () => {
			sendVerificationCodeBySMS('i39e', '+233278459381');
			expect(sendSMSMock).toHaveBeenCalledWith(
				expect.objectContaining({
					message: expect.stringContaining('i39e'),
					to: expect.stringContaining('+233278459381')
				})
			);
		});
	});

	describe('#sendVerificationCodeByMedia', () => {
		test('should send verification code to email address if media is email', () => {
			sendVerificationCodeByMedia({
				media: 'email',
				verificationCode: '94928',
				email: 'test@test.com'
			});
			expect(sendMailMock).toHaveBeenCalled();
			expect(sendSMSMock).not.toHaveBeenCalled();
		});

		test('should send verification code to phone if media is phoneNumber', () => {
			sendVerificationCodeByMedia({
				media: 'phoneNumber',
				verificationCode: '94928',
				phoneNumber: '+6383940388'
			});
			expect(sendSMSMock).toHaveBeenCalled();
			expect(sendMailMock).not.toHaveBeenCalled();
		});

		test('should not send verification code if phone or email is empty', () => {
			sendVerificationCodeByMedia({
				media: 'phoneNumber',
				verificationCode: '94928'
			});
			expect(sendMailMock).not.toHaveBeenCalled();
			expect(sendSMSMock).not.toHaveBeenCalled();
		});
	});
});
