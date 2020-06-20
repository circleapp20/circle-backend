import { Constants } from 'base/constants';
import { IApiRoute } from 'base/types';
import { searchUsernameOrEmail } from '../controllers/searchUsers';
import { resetUserPassword, updateProfile } from '../controllers/updateUsers';
import { CheckUsernameSchema } from './schema/searchUserApiSchema';
import { ResetPasswordSchema, UpdateUserProfileSchema } from './schema/updateUserApiSchema';

export const usersRoutes: IApiRoute[] = [
	{
		path: '/users/profile',
		method: 'put',
		controller: updateProfile,
		privileges: [Constants.privileges.USER],
		schema: UpdateUserProfileSchema
	},
	{
		path: '/users/search',
		method: 'get',
		controller: searchUsernameOrEmail,
		schema: CheckUsernameSchema,
		type: 'query'
	},
	{
		path: '/users/reset/password',
		method: 'put',
		controller: resetUserPassword,
		schema: ResetPasswordSchema,
		privileges: [Constants.privileges.USER]
	}
];
