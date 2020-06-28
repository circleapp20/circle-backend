import { apiPost } from 'base/apiService/common/apiAxiosPost';
import { IApiSuccessResponse } from 'base/apiService/common/responseTypes';
import { Constants } from 'base/config/browser/constants';
import { processApiResponseError } from 'base/errors/browser/processApiResponseError';
import { getDataInWebStorage } from 'base/storage/browser/webStorage';

export const addLocationApiAction = async (args: {
	name: string;
	placeId: any;
	address: string;
	latitude: number;
	longitude: number;
}): Promise<IApiSuccessResponse> => {
	try {
		const user = getDataInWebStorage(Constants.keys.STORED_AUTH_USER_KEY);
		await apiPost('/locations', { data: args }, Constants.services.MAIN, {
			authorization: `Bearer ${user!.token}`
		});
		return { success: true };
	} catch (error) {
		return processApiResponseError(error);
	}
};
