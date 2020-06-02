import { getMailHeaders, sendMail, sendSMSMessage } from '../../_shared/services';
import { printToConsole } from '../../_shared/services/utilities';
import { VERIFICATION_CODE_EMAIL_TEMPLATE } from './_helpers/templates';

export const getVerificationEmailText = (code: string, user = 'User') => {
	const template = VERIFICATION_CODE_EMAIL_TEMPLATE;
	return template.replace('{verificationCode}', code).replace('{user}', user);
};

export const sendVerificationCodeByEmail = (code: string, email: string) => {
	if (!email) return;
	const message = getVerificationEmailText(code);
	const emailHeaders = getMailHeaders({
		to: email,
		subject: 'Circle Verification Code',
		html: message
	});
	sendMail(emailHeaders).catch(printToConsole);
};

export const sendVerificationCodeBySMS = (code: string, phoneNumber: string) => {
	if (!phoneNumber) return;
	const message = `<#> Your circle verification code is :${code}\njdzOJsciqVb`;
	sendSMSMessage({ message, to: phoneNumber }).catch(printToConsole);
};

export const sendVerificationCodeByMedia = (args: {
	verificationCode: string;
	media: 'email' | 'phoneNumber';
	email?: string;
	phoneNumber?: string;
}) => {
	const { verificationCode, media, email, phoneNumber } = args;
	if (email && media === 'email') return sendVerificationCodeByEmail(verificationCode, email);
	if (phoneNumber && media === 'phoneNumber') {
		return sendVerificationCodeBySMS(verificationCode, phoneNumber);
	}
	return;
};
