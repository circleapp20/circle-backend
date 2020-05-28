import { Constants } from '../_shared/constants';
import { IApiRoute } from '../_shared/types';
import { verifyUserCredentials, verifyUserVerificationCode } from './Authentication';
import { updateProfile } from './Users';

export const apiRoutes: IApiRoute[] = [
	{
		path: '/auth/verify',
		method: 'post',
		controller: verifyUserCredentials
	},
	{
		path: '/auth/verify/code',
		method: 'post',
		controller: verifyUserVerificationCode,
		privileges: [Constants.privileges.SUPER_ADMIN, Constants.privileges.USER]
	},
	{
		path: '/users/profile',
		method: 'put',
		controller: updateProfile,
		privileges: [Constants.privileges.USER]
	}
];
