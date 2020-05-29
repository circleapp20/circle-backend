import { Constants } from '../_shared/constants';
import { IApiRoute } from '../_shared/types';
import {
	verifyUserCredentials,
	VerifyUserCredentialsSchema,
	verifyUserLogin,
	VerifyUserLoginSchema,
	verifyUserVerificationCode,
	VerifyVerificationCodeSchema
} from './Authentication';
import { updateProfile, UpdateUserProfileSchema } from './Users';

export const apiRoutes: IApiRoute[] = [
	{
		path: '/auth/verify/sign-up',
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
	},
	{
		path: '/auth/verify/sign-in',
		method: 'post',
		controller: verifyUserLogin,
		schema: VerifyUserLoginSchema
	}
];
