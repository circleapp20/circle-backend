import { Constants } from '../../../_shared/constants';
import * as service from '../../../_shared/services/mailService';
import { getVerificationEmailText, sendVerificationCodeByEmail } from '../authService';
import { VERIFICATION_CODE_EMAIL_TEMPLATE } from '../_helpers/templates';

describe('#authService', () => {
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
		const message = VERIFICATION_CODE_EMAIL_TEMPLATE.replace(
			'{verificationCode}',
			'fu83m'
		).replace('{user}', 'User');

		test('should send email with verification code', async () => {
			const mockFn = jest.spyOn(service, 'sendMail');
			mockFn.mockResolvedValueOnce(true);
			sendVerificationCodeByEmail('fu83m', 'test@test.com');
			expect(mockFn).toHaveBeenCalledWith({
				from: Constants.accounts.EMAIL_ADDRESS,
				html: message,
				subject: 'Circle Verification Code',
				to: 'test@test.com'
			});
		});
	});
});
