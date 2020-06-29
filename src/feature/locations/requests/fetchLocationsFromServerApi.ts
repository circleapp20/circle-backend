import { apiGet } from 'base/apiFunctions/apiGet';
import { BROWSER } from 'base/config/browser';
import { LOCATION } from 'feature/locations/config/location';
import { IApiLocation } from 'feature/locations/requests/locationTypes';

export const fetchLocationsFromServerApi = async (): Promise<IApiLocation[]> => {
	const response = await apiGet(LOCATION.api.LOCATIONS, BROWSER.services.MAIN);
	return response.data;
};
