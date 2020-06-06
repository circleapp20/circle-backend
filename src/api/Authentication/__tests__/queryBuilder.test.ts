import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { countMatchingIdAndCodeQuery, updateUserVerificationCodeQuery } from '../queryBuilder';

jest.mock('../../../_shared/services/schemaService');

beforeEach(() => jest.clearAllMocks());

describe('#queryBuilder', () => {
	describe('#countMatchingIdAndCodeQuery', () => {
		const id = '8409-853';
		const verificationCode = '23ngt';

		test('should search users table', async () => {
			await countMatchingIdAndCodeQuery(entityManager, id, verificationCode);
			expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
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

	describe('#updateUserVerificationCodeQuery', () => {
		const values = { id: '39fn939f9', verificationCode: '384kde' };
		test('should update the users table', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
		});

		test('should set the new verification code', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.set).toHaveBeenCalledWith(
				expect.objectContaining({ verificationCode: expect.any(String) })
			);
		});

		test('should update only where the id matches the user id', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith(
				'u.id = :id',
				expect.objectContaining({ id: expect.any(String) })
			);
		});

		test('should execute the query builder', async () => {
			await updateUserVerificationCodeQuery(entityManager, values);
			expect(entityManager.execute).toHaveBeenCalled();
		});
	});
});
