import Joi from '@hapi/joi';

export const AddStoreSchema = Joi.object().keys({
	data: Joi.object().keys({
		name: Joi.string().required(),
		category: Joi.string().required(),
		locationId: Joi.string().required()
	})
});
