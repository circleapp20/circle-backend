import { Users } from 'base/common/schema/users';
import { EntityManager } from 'typeorm';
import { IUpdateUserProfile } from './updateUserTypes';

export const updateUserProfileQuery = (manager: EntityManager, values: IUpdateUserProfile) => {
	const { id, ...rest } = values;
	return manager.createQueryBuilder().update(Users).set(rest).where('id = :id', { id }).execute();
};
