import { VERIFICATION_CODE_EMAIL_TEMPLATE } from 'feature/authentication/common/templates';

export const getVerificationEmailText = (code: string, user = 'User') => {
	const template = VERIFICATION_CODE_EMAIL_TEMPLATE;
	return template.replace('{verificationCode}', code).replace('{user}', user);
};
