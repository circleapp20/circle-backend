import Joi from '@hapi/joi';

export const VerifyVerificationCodeSchema = Joi.object({
	data: Joi.object({
		verificationCode: Joi.string().required().min(3)
	})
});

export const VerifyUserCredentialsSchema = Joi.object({
	data: Joi.object({
		email: Joi.string().allow(null, ''),
		phoneNumber: Joi.string().allow(null, '')
	})
});

export const VerifyUserLoginSchema = Joi.object({
	data: Joi.object({
		email: Joi.string().allow(null, ''),
		phoneNumber: Joi.string().allow(null, ''),
		username: Joi.string().allow(null, ''),
		password: Joi.string().required().min(6)
	})
});
