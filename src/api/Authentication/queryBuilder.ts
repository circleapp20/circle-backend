import { EntityManager } from 'typeorm';
import { Users } from '../../_shared/services';
import { IAddUserProfile } from './_helpers/types';

// getUserByEmailOrPhoneNumberQuery function creates a queryBuilder
// which will get an existing user from the users table if the email
// or the phoneNumber matches with any in the table.
// the email takes precedence over the phoneNumber if both are set
export const getUserByEmailOrPhoneNumberQuery = (
	manager: EntityManager,
	value: { email?: string; phoneNumber?: string }
) => {
	const { email = null, phoneNumber = null } = value;
	const query = manager.getRepository(Users).createQueryBuilder();
	if (email) query.where('email = :email', { email });
	else query.where('phoneNumber = :phoneNumber', { phoneNumber });
	return query.getOne();
};

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
		.createQueryBuilder()
		.where('id = :id', { id })
		.andWhere('verificationCode = :code', { code: verificationCode })
		.getCount();
};

export const getUserByCredentialsQuery = (
	manager: EntityManager,
	values: { email?: string; phoneNumber?: string; username?: string }
) => {
	const { email, phoneNumber, username } = values;
	const query = manager.getRepository(Users).createQueryBuilder();
	if (username) query.where('username = :username', { username });
	else if (phoneNumber) query.where('phoneNumber = :phoneNumber', { phoneNumber });
	else query.where('email = :email', { email });
	return query.getOne();
};
