import { runInsertQuery, runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { addUserTransaction, createUserProfileWithDefaultValues } from '../dataService';

jest.mock('../../../_shared/services/dBService');

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
	describe('#addUserTransaction', () => {
		test('should create a new user with email', async () => {
			// @ts-ignore
			runInsertQuery.mockResolvedValueOnce([{ id: 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77' }]);
			// @ts-ignore
			runQuery.mockResolvedValueOnce({
				id: 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77',
				biography: '',
				dob: new Date(),
				email: ''
			});

			const transaction = addUserTransaction('test@test.com');
			const results = await transaction(entityManager);

			expect(results).toHaveProperty('id');
		});
	});

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
