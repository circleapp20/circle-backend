import { Locations } from 'core/models/node/locations';
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
