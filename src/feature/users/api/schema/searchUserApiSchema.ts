import Joi from '@hapi/joi';

export const CheckUsernameSchema = Joi.object().keys({
	username: Joi.string().allow(null, ''),
	email: Joi.string().allow(null, '')
});
