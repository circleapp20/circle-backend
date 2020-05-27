import { IApiRoute } from '../_shared/types';
import { verifyUserCredentials, verifyUserVerificationCode } from './Authentication';

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
	}
];
