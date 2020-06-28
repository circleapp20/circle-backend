import { useGet } from 'base/hooks/useGet';
import { LocationConstants } from 'feature/locations/config/constants';
import { fetchLocationDetailsFromServerApi } from 'feature/locations/requests/fetchLocationDetailsFromServerApi';

export const useLocationDetails = (id?: string) => {
	const url = `${LocationConstants.api.LOCATIONS}/${id}`;
	const response = useGet(url, () => fetchLocationDetailsFromServerApi(id || ''));
	return response;
};
