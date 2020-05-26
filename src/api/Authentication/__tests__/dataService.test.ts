import { runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { createUserProfileWithDefaultValues } from '../dataService';

jest.mock('../../../_shared/services/dBService');

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
	describe('#createUserProfileWithDefaultValues', () => {
		test('should create a new user if not exists', async () => {
			// @ts-ignore
			// runQuery.mockReturnValueOnce({ id: '0932kdi393jdf2' });
			await createUserProfileWithDefaultValues({ email: 'test@test.com' });
			expect(runQuery).toHaveBeenCalled();
			expect(runInTransaction).toHaveBeenCalled();
		});
	});
});
