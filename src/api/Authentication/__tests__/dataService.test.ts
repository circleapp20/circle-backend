import { runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { createUserProfileWithDefaultValues } from '../dataService';

jest.mock('../../../_shared/services/dBService');

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
	describe('#createUserProfileWithDefaultValues', () => {
		test('should create a new user if not exists', async () => {
			await createUserProfileWithDefaultValues({ email: 'test@test.com' });
			expect(runQuery).toHaveBeenCalled();
			expect(runInTransaction).toHaveBeenCalled();
		});

		test('should throw an error if user already exists', (done) => {
			// @ts-ignore
			runQuery.mockReturnValueOnce({ id: '0932kdi393jdf2' });
			createUserProfileWithDefaultValues({ email: 'test@test.com' }).catch((error) => {
				expect(error.message).toBe('User already exists');
				expect(error.status).toBe(400);
				done();
			});
		});
	});
});
