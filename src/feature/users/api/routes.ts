import { SERVER } from 'base/config/server';
import { IApiRoute } from 'base/types';
import { searchUsernameOrEmail } from 'feature/users/controllers/searchUsers';
import { resetUserPassword, updateProfile } from 'feature/users/controllers/updateUsers';
import { CheckUsernameSchema } from './schema/searchUserApiSchema';
import { ResetPasswordSchema, UpdateUserProfileSchema } from './schema/updateUserApiSchema';

export const usersRoutes: IApiRoute[] = [
	{
		path: '/users/profile',
		method: 'put',
		controller: updateProfile,
		privileges: [SERVER.privileges.USER],
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
		privileges: [SERVER.privileges.USER]
	}
];
