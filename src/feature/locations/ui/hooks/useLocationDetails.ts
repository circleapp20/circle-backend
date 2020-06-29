import { useGet } from 'base/ui/hooks/useGet';
import { LOCATION } from 'feature/locations/config/location';
import { fetchLocationDetailsFromServerApi } from 'feature/locations/requests/fetchLocationDetailsFromServerApi';

export const useLocationDetails = (id?: string) => {
	const url = `${LOCATION.api.LOCATIONS}/${id}`;
	const response = useGet(url, () => fetchLocationDetailsFromServerApi(id || ''));
	return response;
};
