import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__utils__/testUtils';
import { addUserProfileQuery, getUserByEmailOrPhoneNumberQuery } from '../queryBuilder';
import { IAddUserProfile } from '../_helpers/types';

jest.mock('../../../_shared/services/schemaService.ts');

beforeEach(() => jest.clearAllMocks());

describe('#queryBuilder', () => {
	describe('#getUserByEmailOrPhoneNumberQuery', () => {
		const email = 'test@test.com';
		const phoneNumber = '+2332456987';

		test('should call the Users schema', async () => {
			await getUserByEmailOrPhoneNumberQuery(entityManager, {
				email
			});
			expect(entityManager.getRepository).toBeCalledWith(Users);
		});

		test('should construct a query builder using createQueryBuilder', async () => {
			await getUserByEmailOrPhoneNumberQuery(entityManager, {
				email
			});
			expect(entityManager.createQueryBuilder).toBeCalledWith();
		});

		test('should use the email in the where function when set', async () => {
			await getUserByEmailOrPhoneNumberQuery(entityManager, {
				email
			});
			expect(entityManager.where).toBeCalledWith('email = :email', { email });
			expect(entityManager.where).toBeCalledTimes(1);
		});

		test('should check with phone number when set', async () => {
			await getUserByEmailOrPhoneNumberQuery(entityManager, {
				phoneNumber
			});
			expect(entityManager.where).toBeCalledWith('phoneNumber = :phoneNumber', {
				phoneNumber
			});
			expect(entityManager.where).toBeCalledTimes(1);
		});

		test('should call getOne', async () => {
			await getUserByEmailOrPhoneNumberQuery(entityManager, {
				phoneNumber
			});
			expect(entityManager.getOne).toBeCalledTimes(1);
		});
	});

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
			verificationCode: ''
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
});