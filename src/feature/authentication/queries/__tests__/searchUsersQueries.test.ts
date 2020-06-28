import { entityManager } from 'base/testUtils/node/entityManager';
import { Users } from 'core/models/node/users';
import { countMatchingIdAndCodeQuery } from 'feature/authentication/queries/searchUsersQueries';

jest.mock('core/models/node/users');

beforeEach(() => jest.clearAllMocks());

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
