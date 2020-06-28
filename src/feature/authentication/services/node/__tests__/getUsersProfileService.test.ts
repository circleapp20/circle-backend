import { entityManager } from 'base/testUtils/node/entityManager';
import { runQuery } from 'core/database/queryRunners';
import { encryptData } from 'core/encryption/node/encryption';
import { getUserProfileById } from 'feature/authentication/services/node/getUsersProfileService';
import { createUserFixture } from 'fixtures/users';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/users');
jest.mock('core/models/node/fellows');

beforeEach(() => jest.clearAllMocks());

describe('#getUserProfileById', () => {
	test('should call getUserByIdQuery with the user id', async () => {
		const user = createUserFixture();
		const verificationCode = encryptData({ text: '783465' });
		entityManager.getOne.mockReturnValueOnce(Object.assign(user, { verificationCode }));
		await getUserProfileById(user.id);
		expect(runQuery).toHaveBeenCalledWith(
			expect.any(Function),
			expect.arrayContaining([user.id])
		);
	});

	test('should throw error if user does not exists', () => {
		entityManager.getOne.mockReturnValueOnce(null);
		expect(getUserProfileById('x39-39ng39-nf39')).rejects.toThrowErrorMatchingSnapshot();
	});
});
