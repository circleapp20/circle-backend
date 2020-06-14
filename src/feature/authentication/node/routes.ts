import * as schema from 'feature/authentication/common/dataSchema';
import * as controller from 'feature/authentication/node/controllers';
import { Constants } from 'shared/constants';
import { IApiRoute } from 'shared/types';

export const authRoutes: IApiRoute[] = [
	{
		path: '/auth/sign-up',
		method: 'post',
		controller: controller.verifyUserCredentials,
		schema: schema.VerifyUserCredentialsSchema
	},
	{
		path: '/auth/code',
		method: 'post',
		controller: controller.verifyUserVerificationCode,
		privileges: [Constants.privileges.SUPER_ADMIN, Constants.privileges.USER],
		schema: schema.VerifyVerificationCodeSchema
	},
	{
		path: '/auth/sign-in',
		method: 'post',
		controller: controller.verifyUserLogin,
		schema: schema.VerifyUserLoginSchema
	},
	{
		path: '/auth/code/resend',
		method: 'post',
		controller: controller.resendUserVerificationCode,
		privileges: [Constants.privileges.USER]
	},
	{
		path: '/auth/credentials',
		method: 'post',
		controller: controller.verifyUserCredentialsForPasswordReset
	}
];
