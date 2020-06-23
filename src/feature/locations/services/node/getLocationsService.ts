import { runQuery } from 'core/database/queryRunners';
import { getLocationsQuery } from 'feature/locations/queries/getLocationQueries';
import { changeLocationPlacesName } from 'feature/locations/utilities/common/objects';

export const getCircleLocations = async () => {
	const locations = await runQuery(getLocationsQuery);
	const updatedLocations = locations.map((location) => changeLocationPlacesName(location));
	return updatedLocations;
};
