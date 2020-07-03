import { apiGet } from 'base/apiFunctions/apiGet';
import { BROWSER } from 'base/config/browser';
import { LOCATION } from 'feature/locations/config/location';
import { IApiLocation } from 'feature/locations/requests/locationTypes';

export const fetchLocationDetailsFromServerApi = async (id: string): Promise<IApiLocation> => {
	const url = `${LOCATION.api.LOCATIONS}/${id}`;
	const response = await apiGet(url, BROWSER.services.MAIN);
	return response.data;
};
