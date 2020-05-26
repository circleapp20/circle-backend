import { IApiRoute } from '../_shared/types';
import { verifyUserCredentials } from './Authentication';

export const apiRoutes: IApiRoute[] = [
	{
		path: '/auth/verify',
		method: 'post',
		controller: verifyUserCredentials
	}
];
