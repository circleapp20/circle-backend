import Joi from '@hapi/joi';

export const AddLocationSchema = Joi.object().keys({
	data: Joi.object().keys({
		name: Joi.string().required().min(2),
		address: Joi.string().allow(''),
		latitude: Joi.number(),
		longitude: Joi.number(),
		placeId: Joi.string().allow(null, '')
	})
});
