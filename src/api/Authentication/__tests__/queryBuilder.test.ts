import { Constants } from '../../../_shared/constants';
import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import {
	addUserProfileQuery,
	countMatchingIdAndCodeQuery,
	getUserByCredentialsQuery,
	updateUserVerificationCodeQuery
} from '../queryBuilder';
import { IAddUserProfile } from '../_helpers/types';

jest.mock('../../../_shared/services/schemaService');

beforeEach(() => jest.clearAllMocks());

describe('#queryBuilder', () => {
	describe('#addUserProfileQuery', () => {
		const profile: IAddUserProfile = {
			username: '',
			password: '',
			dob: new Date(),
			image: '',
			biography: '',
			email: '',
			phoneNumber: '',
			isEmailVerified: false,
			verificationCode: '',
			roles: [Constants.privileges.USER]
		};

		test('should be called with an entity manager', async () => {
			await addUserProfileQuery(entityManager, profile);
			expect(entityManager.insert).toHaveBeenCalledTimes(1);
			expect(entityManager.values).toHaveBeenCalledTimes(1);
			expect(entityManager.execute).toHaveBeenCalledTimes(1);
		});

		test('should call values with profile value', async () => {
			await addUserProfileQuery(entityManager, profile);
			expect(entityManager.values).toHaveBeenCalledWith(profile);
		});

		test('should return insert query results', async () => {
			const results = await addUserProfileQuery(entityManager, profile);
			expect(results).toEqual({ generatedMaps: [] });
		});
	});

	describe('#countMatchingIdAndCodeQuery', () => {
		const id = '8409-853';
		const verificationCode = '23ngt';

		test('should search users table', async () => {
			await countMatchingIdAndCodeQuery(entityManager, id, verificationCode);
			expect(entityManager.getRepository).toHaveBeenCalledWith(Users);
		});

		test('should use id in the where clause', async () => {
			await countMatchingIdAndCodeQuery(entityManager, id, verificationCode);
			expect(entityManager.where).toHaveBeenCalledWith('u.id = :id', { id });
		});

		test('should add the verification code to where clause', async () => {
			await countMatchingIdAndCodeQuery(entityManager, id, verificationCode);
			expect(entityManager.andWhere).toHaveBeenCalledWith('u.verificationCode = :code', {
				code: verificationCode
			});
		});

		test('should get the total count results of the search', async () => {
			await countMatchingIdAndCodeQuery(entityManager, id, verificationCode);
			expect(entityManager.getCount).toHaveBeenCalled();
		});
	});

	describe('#getUserByCredentialsQuery', () => {
		test('should search database with username if defined', async () => {
			const values = { username: 'username', phoneNumber: '', email: '' };
			await getUserByCredentialsQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith('u.username = :username', {
				username: values.username
			});
		});

		test('should search users with phoneNumber', async () => {
			const values = { username: '', phoneNumber: '+1-422-847-4939', email: '' };
			await getUserByCredentialsQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith('u.phoneNumber = :phoneNumber', {
				phoneNumber: values.phoneNumber
			});
		});

		test('should search users with email if defined', async () => {
			const values = { username: '', phoneNumber: '', email: 'test@test.com' };
			await getUserByCredentialsQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith('u.email = :email', {
				email: values.email
			});
		});
	});

	describe('#updateUserVerificationCodeQuery', () => {
		const values = { id: '39fn939f9', verificationCode: '384kde' };
		test('should update the users table', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.getRepository).toHaveBeenCalledWith(Users);
		});

		test('should set the new verification code', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.set).toHaveBeenCalledWith(
				expect.objectContaining({
					verificationCode: expect.any(String)
				})
			);
		});

		test('should update only where the id matches the user id', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith(
				'id = :id',
				expect.objectContaining({
					id: expect.any(String)
				})
			);
		});

		test('should execute the query builder', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.execute).toHaveBeenCalled();
		});
	});
});
