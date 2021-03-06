import { Locations } from 'core/models/node/locations';
import { EntityManager } from 'typeorm';

/**
 * functions creates a query builder that returns the raw results.
 * retrieves the locations in the order of states, cities and streets
 * @param manager typeorm entity manager
 */
export const getLocationsQuery = (manager: EntityManager) => {
	return manager
		.createQueryBuilder(Locations, 'locations')
		.leftJoinAndSelect('locations.places', 'states') // get related locations as states
		.leftJoinAndSelect('states.places', 'cities') // get related location as cities for states
		.leftJoinAndSelect('cities.places', 'streets') // get locations as streets for cities
		.where('locations.place IS NULL')
		.getMany();
};
