import { object, string } from '@hapi/joi';

export const VerifyVerificationCodeSchema = object({
	data: object({
		verificationCode: string().required().min(3)
	})
});

export const VerifyUserCredentialsSchema = object({
	data: object({
		email: string().allow(null, ''),
		phoneNumber: string().allow(null, '')
	})
});
