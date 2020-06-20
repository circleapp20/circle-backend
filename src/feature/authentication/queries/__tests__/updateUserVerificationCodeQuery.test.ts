import { Users } from 'base/common/schema/users';
import { entityManager } from 'base/testUtils/node/entityManager';
import { updateUserVerificationCodeQuery } from '../updateUserVerificationCodeQuery';

jest.mock('base/common/schema/users');

beforeEach(() => jest.clearAllMocks());

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
			'id = :id',
			expect.objectContaining({ id: expect.any(String) })
		);
	});

	test('should execute the query builder', async () => {
		await updateUserVerificationCodeQuery(entityManager, values);
		expect(entityManager.execute).toHaveBeenCalled();
	});
});
