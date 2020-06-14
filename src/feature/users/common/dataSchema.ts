import Joi from '@hapi/joi';

export const UpdateUserProfileSchema = Joi.object({
	data: Joi.object().keys({
		username: Joi.string().required().min(4),
		password: Joi.string().required().min(6),
		image: Joi.string().allow(null, ''),
		biography: Joi.string().allow(null, ''),
		dob: Joi.date().allow(null, ''),
		name: Joi.string().required().min(3),
		email: Joi.string().allow(null, ''),
		phoneNumber: Joi.string().allow(null, '')
	})
});

export const CheckUsernameSchema = Joi.object().keys({
	username: Joi.string().allow(null, ''),
	email: Joi.string().allow(null, '')
});

export const ResetPasswordSchema = Joi.object().keys({
	data: Joi.object().keys({
		password: Joi.string().required().min(6)
	})
});
