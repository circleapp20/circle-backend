import { Users } from 'base/common/schema/users';
import { EntityManager } from 'typeorm';
import { IAddUserLocation, IUpdateUserProfile } from './updateUserTypes';

export const updateUserProfileQuery = (manager: EntityManager, values: IUpdateUserProfile) => {
	const { id, ...rest } = values;
	return manager.createQueryBuilder().update(Users).set(rest).where('id = :id', { id }).execute();
};

export const addUserLocationsQuery = (manager: EntityManager, values: IAddUserLocation) => {
	const { id, locationsId } = values;
	return manager.createQueryBuilder().relation(Users, 'locations').of(id).add(locationsId);
};
