import { Locations } from 'core/models/node/locations';
import { Stores } from 'core/models/node/stores';
import { Users } from 'core/models/node/users';
import { EntityManager } from 'typeorm';

interface IAddStore {
	name: string;
	isVerified: boolean;
	category: string;
}

export const addStoreQuery = (manager: EntityManager, values: IAddStore) => {
	return manager.createQueryBuilder(Stores, 'stores').insert().values(values).execute();
};

interface IAddStoreLocation {
	locationId: string;
	storeId: string;
}

export const addStoreLocationQuery = (manager: EntityManager, values: IAddStoreLocation) => {
	return manager
		.createQueryBuilder()
		.relation(Locations, 'stores')
		.of(values.locationId)
		.add(values.storeId);
};

interface IAddStoreUser {
	userId: string;
	storeId: string;
}

export const addStoreUserQuery = (manager: EntityManager, values: IAddStoreUser) => {
	return manager
		.createQueryBuilder()
		.relation(Users, 'stores')
		.of(values.userId)
		.add(values.storeId);
};
