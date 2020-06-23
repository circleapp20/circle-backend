import { Users } from 'core/models/node/users';
import { EntityManager } from 'typeorm';

export const countMatchingIdAndCodeQuery = (
	manager: EntityManager,
	id: string,
	verificationCode: string
) => {
	return manager
		.createQueryBuilder(Users, 'u')
		.where('u.id = :id', { id })
		.andWhere('u.verificationCode = :code', { code: verificationCode })
		.getCount();
};
