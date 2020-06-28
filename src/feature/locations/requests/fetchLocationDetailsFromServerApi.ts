import { apiGet } from 'base/apiService/common/apiAxiosGet';
import { Constants } from 'base/config/browser/constants';
import { LocationConstants } from 'feature/locations/config/constants';
import { IApiLocation } from 'feature/locations/requests/locationTypes';

export const fetchLocationDetailsFromServerApi = async (id: string): Promise<IApiLocation> => {
	const url = `${LocationConstants.api.LOCATIONS}/${id}`;
	const response = await apiGet(url, Constants.services.MAIN);
	return response.data;
};
