import { Constants } from 'base/config/node/constants';
import { IApiRoute } from 'base/types';
import {
	VerifyUserCredentialsSchema,
	VerifyUserLoginSchema,
	VerifyVerificationCodeSchema
} from 'feature/authentication/api/schema/verifyUserSchema';
import { resendUserVerificationCode } from 'feature/authentication/controllers/resendUserVerificationCodeHandler';
import {
	verifyUserCredentials,
	verifyUserCredentialsForPasswordReset,
	verifyUserLogin,
	verifyUserVerificationCode
} from 'feature/authentication/controllers/verifyUserHandlers';

export const authRoutes: IApiRoute[] = [
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
		path: '/auth/sign-in',
		method: 'post',
		controller: verifyUserLogin,
		schema: VerifyUserLoginSchema
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
