import { date, object, string } from '@hapi/joi';

export const UpdateUserProfileSchema = object({
	data: object({
		username: string().required().min(4),
		password: string().required().min(6),
		image: string().allow(null, ''),
		biography: string().allow(null, ''),
		dob: date().allow(null, '')
	})
});
