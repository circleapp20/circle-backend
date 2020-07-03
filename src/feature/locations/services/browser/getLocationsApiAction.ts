import { apiGet } from 'base/apiFunctions/apiGet';
import { IApiDataResponse } from 'base/apiFunctions/responseTypes';
import { BROWSER } from 'base/config/browser';
import { processApiResponseError } from 'base/utils/errors/browser/processApiResponseError';
import { IApiLocation } from 'feature/locations/requests/locationTypes';

export const getLocationsApiAction = async (): Promise<IApiDataResponse<IApiLocation[]>> => {
	try {
		const response = await apiGet('/locations', BROWSER.services.MAIN);
		return { data: response.data };
	} catch (error) {
		const e = processApiResponseError(error);
		return { ...e, data: null };
	}
};
