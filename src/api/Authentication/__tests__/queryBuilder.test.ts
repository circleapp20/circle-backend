import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import {
	addUserProfileQuery,
	countMatchingIdAndCodeQuery,
	getUserByEmailOrPhoneNumberQuery,
	getUserByIdQuery
} from '../queryBuilder';
import { IAddUserProfile } from '../_helpers/types';

jest.mock('../../../_shared/services/schemaService');

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

	describe('#getUserByIdQuery', () => {
		test('should create query builder from Users with the id', async () => {
			const id = 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77';
			await getUserByIdQuery(entityManager, id);
			expect(entityManager.getRepository).toHaveBeenCalledWith(Users);
			expect(entityManager.where).toHaveBeenCalledWith('id = :id', { id });
			expect(entityManager.getOne).toHaveBeenCalled();
		});
	});

	describe('#countMatchingIdAndCodeQuery', () => {
		test('should call where with id and code', async () => {
			const id = '8409-853';
			const verificationCode = '23ngt';
			await countMatchingIdAndCodeQuery(entityManager, id, verificationCode);
			expect(entityManager.where).toHaveBeenCalledWith('id = :id', { id });
			expect(entityManager.andWhere).toHaveBeenCalledWith('verificationCode = :code', {
				code: verificationCode
			});
			expect(entityManager.getCount).toHaveBeenCalled();
		});
	});
});
