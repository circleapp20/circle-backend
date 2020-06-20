import { Users } from 'base/common/schema/users';
import { EntityManager } from 'typeorm';

export const updateUserVerificationCodeQuery = (
	manager: EntityManager,
	values: { id: string; verificationCode: string }
) => {
	const { id, verificationCode } = values;
	return manager
		.createQueryBuilder(Users, 'u')
		.update()
		.set({ verificationCode })
		.where('id = :id', { id })
		.execute();
};
