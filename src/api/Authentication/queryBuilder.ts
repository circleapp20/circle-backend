import { EntityManager } from 'typeorm';
import { Users } from '../../_shared/services';
import { IAddUserProfile } from './_helpers/types';

export const addUserProfileQuery = (manager: EntityManager, values: IAddUserProfile) => {
	return manager.getRepository(Users).createQueryBuilder().insert().values(values).execute();
};

export const countMatchingIdAndCodeQuery = (
	manager: EntityManager,
	id: string,
	verificationCode: string
) => {
	return manager
		.getRepository(Users)
		.createQueryBuilder('u')
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
		.getRepository(Users)
		.createQueryBuilder()
		.update()
		.set({ verificationCode })
		.where('id = :id', { id })
		.execute();
};
