import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import {
	countMatchingEmailQuery,
	countMatchingUsernameQuery,
	updateUserProfileQuery
} from '../queryBuilder';
import { IUpdateUserProfile } from '../_helpers/types';

jest.mock('../../../_shared/services/schemaService');

beforeEach(() => jest.clearAllMocks());

describe('#queryBuilder', () => {
	describe('#updateUserProfileQuery', () => {
		test('should update profile matching id', async () => {
			const values: IUpdateUserProfile = {
				username: 'ghEi39',
				password: '039mdi39k3903jdm933kr93',
				dob: new Date(),
				image: '',
				biography: '',
				id: '93i49m-3jd8k'
			};
			const { id, ...rest } = values;
			await updateUserProfileQuery(entityManager, values);
			expect(entityManager.update).toHaveBeenCalledTimes(1);
			expect(entityManager.set).toHaveBeenCalledWith(rest);
			expect(entityManager.where).toHaveBeenLastCalledWith('id = :id', { id });
		});
	});

	describe('#countMatchingUsernameQuery', () => {
		test('should search Users table matching username', async () => {
			const username = 'test';
			await countMatchingUsernameQuery(entityManager, username);
			expect(entityManager.where).toHaveBeenCalledWith('username = :username', { username });
			expect(entityManager.getCount).toHaveBeenCalled();
		});
	});

	describe('#countMatchingEmailQuery', () => {
		test('should create query builder with the Users schema', async () => {
			await countMatchingEmailQuery(entityManager, 'test@test.com');
			expect(entityManager.getRepository).toHaveBeenCalledWith(Users);
		});

		test('should search users table with email', async () => {
			const email = 'test@test.com';
			await countMatchingEmailQuery(entityManager, email);
			expect(entityManager.where).toHaveBeenCalledWith('email = :email', { email });
		});

		test('should call getCount on the entityManager', async () => {
			await countMatchingEmailQuery(entityManager, 'test@test.com');
			expect(entityManager.getCount).toHaveBeenCalled();
		});
	});
});
