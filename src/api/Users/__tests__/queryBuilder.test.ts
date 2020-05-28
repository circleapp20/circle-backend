import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { countMatchingUsernameQuery, updateUserProfileQuery } from '../queryBuilder';
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
});
