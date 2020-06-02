import { Constants } from '../_shared/constants';
import { IApiRoute } from '../_shared/types';
import {
	resendUserVerificationCode,
	verifyUserCredentials,
	verifyUserCredentialsForPasswordReset,
	VerifyUserCredentialsSchema,
	verifyUserLogin,
	VerifyUserLoginSchema,
	verifyUserVerificationCode,
	VerifyVerificationCodeSchema
} from './Authentication';
import {
	CheckUsernameSchema,
	searchUsernameOrEmail,
	updateProfile,
	UpdateUserProfileSchema
} from './Users';

export const apiRoutes: IApiRoute[] = [
	{
		path: '/auth/sign-up',
		method: 'post',
		controller: verifyUserCredentials,
		schema: VerifyUserCredentialsSchema
	},
	{
		path: '/auth/code',
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
		path: '/auth/sign-in',
		method: 'post',
		controller: verifyUserLogin,
		schema: VerifyUserLoginSchema
	},
	{
		path: '/users/search',
		method: 'get',
		controller: searchUsernameOrEmail,
		schema: CheckUsernameSchema,
		type: 'query'
	},
	{
		path: '/auth/code/resend',
		method: 'post',
		controller: resendUserVerificationCode,
		privileges: [Constants.privileges.USER]
	},
	{
		path: '/auth/credentials',
		method: 'post',
		controller: verifyUserCredentialsForPasswordReset
	}
];
