import { Constants } from '../_shared/constants';
import { IApiRoute } from '../_shared/types';
import {
	verifyUserCredentials,
	VerifyUserCredentialsSchema,
	verifyUserVerificationCode,
	VerifyVerificationCodeSchema
} from './Authentication';
import { updateProfile, UpdateUserProfileSchema } from './Users';

export const apiRoutes: IApiRoute[] = [
	{
		path: '/auth/verify',
		method: 'post',
		controller: verifyUserCredentials,
		schema: VerifyUserCredentialsSchema
	},
	{
		path: '/auth/verify/code',
		method: 'post',
		controller: verifyUserVerificationCode,
		privileges: [Constants.privileges.SUPER_ADMIN, Constants.privileges.USER],
		schema: VerifyVerificationCodeSchema
	},
	{
		path: '/users/profile',
		method: 'put',
		controller: updateProfile,
		privileges: [Constants.privileges.USER],
		schema: UpdateUserProfileSchema
	}
];
