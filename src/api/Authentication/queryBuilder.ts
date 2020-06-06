import { EntityManager } from 'typeorm';
import { Users } from '../../_shared/services';

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

export const updateUserVerificationCodeQuery = (
	manager: EntityManager,
	values: { id: string; verificationCode: string }
) => {
	const { id, verificationCode } = values;
	return manager
		.createQueryBuilder(Users, 'u')
		.update()
		.set({ verificationCode })
		.where('u.id = :id', { id })
		.execute();
};
