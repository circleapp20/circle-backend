import { getBadRequestError } from 'base/errors/node/badRequestError';
import { runQuery } from 'core/database/queryRunners';
import {
	getLocationByIdQuery,
	getLocationsQuery
} from 'feature/locations/queries/getLocationQueries';
import { changeLocationPlacesName } from 'feature/locations/utilities/common/objects';

export const getCircleLocations = async () => {
	const locations = await runQuery(getLocationsQuery);
	const updatedLocations = locations.map((location) => changeLocationPlacesName(location));
	return updatedLocations;
};

export const getLocationDetails = async (id: string) => {
	if (!id) throw getBadRequestError('Location id is required');
	const location = await runQuery(getLocationByIdQuery, [id]);
	const formattedLocation = changeLocationPlacesName(location);
	return formattedLocation;
};
