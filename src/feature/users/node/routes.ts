import * as schema from 'feature/users/common/dataSchema';
import * as controller from 'feature/users/node/controllers';
import { Constants } from 'shared/constants';
import { IApiRoute } from 'shared/types';

export const usersRoutes: IApiRoute[] = [
	{
		path: '/users/profile',
		method: 'put',
		controller: controller.updateProfile,
		privileges: [Constants.privileges.USER],
		schema: schema.UpdateUserProfileSchema
	},
	{
		path: '/users/search',
		method: 'get',
		controller: controller.searchUsernameOrEmail,
		schema: schema.CheckUsernameSchema,
		type: 'query'
	},
	{
		path: '/users/reset/password',
		method: 'put',
		controller: controller.resetUserPassword,
		schema: schema.ResetPasswordSchema,
		privileges: [Constants.privileges.USER]
	}
];
