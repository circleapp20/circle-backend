import { Locations } from 'base/common/schema/locations';
import { EntityManager } from 'typeorm';

export const getLocationByIdQuery = (manager: EntityManager, id: string) => {
	return manager
		.createQueryBuilder(Locations, 'locations')
		.leftJoinAndSelect('locations.places', 'states') // get related locations as states
		.leftJoinAndSelect('states.places', 'cities') // get related location as cities for states
		.leftJoinAndSelect('cities.places', 'streets') // get locations as streets for cities
		.where('locations.id = :id', { id })
		.getOne();
};

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
