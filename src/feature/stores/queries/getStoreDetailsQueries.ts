import { Stores } from 'core/models/node/stores';
import { EntityManager } from 'typeorm';

export const getStoreByIdQuery = (manager: EntityManager, id: string) => {
	return manager
		.createQueryBuilder(Stores, 'stores')
		.innerJoinAndSelect('stores.user', 'user')
		.innerJoinAndSelect('stores.location', 'location')
		.where('stores.id = :id')
		.setParameter('id', id)
		.getOne();
};

export const getStoresQuery = (manager: EntityManager) => {
	return manager
		.createQueryBuilder(Stores, 'stores')
		.innerJoinAndSelect('stores.user', 'user')
		.innerJoinAndSelect('stores.location', 'location')
		.orderBy('stores.createdAt', 'DESC')
		.getMany();
};
