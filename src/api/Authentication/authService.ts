import { getMailHeaders, sendMail } from '../../_shared/services';
import { printToConsole } from '../../_shared/services/utilities';
import { VERIFICATION_CODE_EMAIL_TEMPLATE } from './_helpers/templates';

export const getVerificationEmailText = (code: string, user = 'User') => {
	const template = VERIFICATION_CODE_EMAIL_TEMPLATE;
	return template.replace('{verificationCode}', code).replace('{user}', user);
};

export const sendVerificationCodeByEmail = (code: string, email: string) => {
	const message = getVerificationEmailText(code);
	const emailHeaders = getMailHeaders({
		to: email,
		subject: 'Circle Verification Code',
		html: message
	});
	sendMail(emailHeaders).catch(printToConsole);
};
