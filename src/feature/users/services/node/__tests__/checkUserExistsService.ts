import { runQuery } from 'core/node/database/queryRunners';
import { checkUsernameOrEmailExists } from 'feature/users/services/node/checkUserExistsService';

jest.mock('core/node/database/queryRunners');
jest.mock('base/common/schema/users');

beforeEach(() => jest.clearAllMocks());

describe('#checkUsernameOrEmailExists', () => {
	test('should return false for username if does not exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(0);
		const result = await checkUsernameOrEmailExists('username', '');
		expect(result.username).toBeFalsy();
	});

	test('should return true for username if exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(1);
		const result = await checkUsernameOrEmailExists('username', '');
		expect(result.username).toBeTruthy();
	});

	test('should return false if email does not exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(0);
		const result = await checkUsernameOrEmailExists('', 'test@test.com');
		expect(result.email).toBeFalsy();
	});

	test('should return true if email does exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(1);
		const result = await checkUsernameOrEmailExists('', 'test@test.com');
		expect(result.email).toBeTruthy();
	});

	test('should return an object containing email and username', async () => {
		const result = await checkUsernameOrEmailExists('', 'test@test.com');
		expect(result).toEqual(
			expect.objectContaining({
				username: expect.any(Boolean),
				email: expect.any(Boolean)
			})
		);
	});
});
