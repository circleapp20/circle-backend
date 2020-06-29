import { useGet } from 'base/ui/hooks/useGet';
import { LOCATION } from 'feature/locations/config/location';
import { fetchLocationsFromServerApi } from 'feature/locations/requests/fetchLocationsFromServerApi';

export const useLocations = () => {
	const { data, error, loading } = useGet(LOCATION.api.LOCATIONS, fetchLocationsFromServerApi);

	return { error, data, loading };
};
