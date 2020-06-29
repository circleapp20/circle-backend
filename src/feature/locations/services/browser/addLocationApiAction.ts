import { apiPost } from 'base/apiFunctions/apiPost';
import { IApiSuccessResponse } from 'base/apiFunctions/responseTypes';
import { BROWSER } from 'base/config/browser';
import { processApiResponseError } from 'base/utils/errors/browser/processApiResponseError';
import { getDataInWebStorage } from 'base/utils/storage/browser/webStorage';

export const addLocationApiAction = async (args: {
	name: string;
	placeId: any;
	address: string;
	latitude: number;
	longitude: number;
}): Promise<IApiSuccessResponse> => {
	try {
		const user = getDataInWebStorage(BROWSER.keys.STORED_AUTH_USER_KEY);
		await apiPost('/locations', { data: args }, BROWSER.services.MAIN, {
			authorization: `Bearer ${user!.token}`
		});
		return { success: true };
	} catch (error) {
		return processApiResponseError(error);
	}
};
