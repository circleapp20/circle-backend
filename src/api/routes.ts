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
		controller: verifyUserVerificationCode
	},
	{
		path: '/users/profile',
		method: 'put',
		controller: updateProfile
	}
];
