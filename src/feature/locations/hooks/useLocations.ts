import { useGet } from 'base/hooks/useGet';
import { LocationConstants } from 'feature/locations/config/constants';
import { fetchLocationsFromServerApi } from 'feature/locations/requests/fetchLocationsFromServerApi';

export const useLocations = () => {
	const { data, error, loading } = useGet(
		LocationConstants.api.LOCATIONS,
		fetchLocationsFromServerApi
	);

	return { error, data, loading };
};
