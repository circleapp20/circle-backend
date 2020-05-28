import { EntityManager } from 'typeorm';
import { Users } from './schemaService';

export const getUserByIdQuery = (manager: EntityManager, id: string) => {
	return manager.getRepository(Users).createQueryBuilder().where('id = :id', { id }).getOne();
};
