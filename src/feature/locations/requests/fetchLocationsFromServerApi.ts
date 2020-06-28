import { apiGet } from 'base/apiService/common/apiAxiosGet';
import { Constants } from 'base/config/browser/constants';
import { LocationConstants } from 'feature/locations/config/constants';
import { IApiLocation } from 'feature/locations/requests/locationTypes';

export const fetchLocationsFromServerApi = async (): Promise<IApiLocation[]> => {
	const response = await apiGet(LocationConstants.api.LOCATIONS, Constants.services.MAIN);
	return response.data;
};
