import { apiGet } from 'base/apiService/common/apiAxiosGet';
import { IApiDataResponse } from 'base/apiService/common/responseTypes';
import { Constants } from 'base/config/browser/constants';
import { processApiResponseError } from 'base/errors/browser/processApiResponseError';
import { IApiLocation } from 'feature/locations/requests/locationTypes';

export const getLocationsApiAction = async (): Promise<IApiDataResponse<IApiLocation[]>> => {
	try {
		const response = await apiGet('/locations', Constants.services.MAIN);
		return { data: response.data };
	} catch (error) {
		const e = processApiResponseError(error);
		return { ...e, data: null };
	}
};
