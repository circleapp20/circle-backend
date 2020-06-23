import { Locations } from 'core/models/node/locations';
import { EntityManager } from 'typeorm';

interface IAddLocationValues {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	isVerified?: boolean;
}

export const addLocationQuery = (manager: EntityManager, values: IAddLocationValues) => {
	const { isVerified = false, ...rest } = values;
	return manager
		.createQueryBuilder(Locations, 'location')
		.insert()
		.values({
			...rest,
			isVerified
		})
		.execute();
};

interface IAddLocationPlace {
	id: string;
	placeId: string;
}

export const addLocationPlaceQuery = (manager: EntityManager, values: IAddLocationPlace) => {
	return manager
		.createQueryBuilder()
		.relation(Locations, 'places')
		.of(values.placeId) // id of place to relate to
		.add(values.id); // location id
};
