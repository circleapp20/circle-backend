import { getVerificationEmailText } from 'feature/authentication/common/strings';
import { VERIFICATION_CODE_EMAIL_TEMPLATE } from 'feature/authentication/common/templates';

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
