import { apiPost } from 'base/apiFunctions/apiPost';
import { IApiDataResponse } from 'base/apiFunctions/responseTypes';
import { BROWSER } from 'base/config/browser';
import { processApiResponseError } from 'base/utils/errors/browser/processApiResponseError';

export const verifyUserCredentials = async (credentials: {
	email: string;
	password: string;
}): Promise<IApiDataResponse> => {
	try {
		const response = await apiPost(
			'/auth/sign-in',
			{ data: credentials },
			BROWSER.services.MAIN
		);
		return { data: response.data };
	} catch (error) {
		const { error: e } = processApiResponseError(error);
		return Object.assign({}, e, { data: null });
	}
};
