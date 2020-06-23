import { apiPost } from 'base/apiService/common/apiAxiosPost';
import { IApiDataResponse } from 'base/apiService/common/responseTypes';
import { Constants } from 'base/config/browser/constants';
import { processApiResponseError } from 'base/errors/browser/processApiResponseError';

export const verifyUserCredentials = async (credentials: {
	email: string;
	password: string;
}): Promise<IApiDataResponse> => {
	try {
		const response = await apiPost(
			'/auth/sign-in',
			{ data: credentials },
			Constants.services.MAIN
		);
		return { data: response.data };
	} catch (error) {
		const { error: e } = processApiResponseError(error);
		return Object.assign({}, e, { data: null });
	}
};
