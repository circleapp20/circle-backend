import { runInsertQuery, runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import {
	addUserTransaction,
	checkUserVerificationCode,
	createUserProfileWithDefaultValues
} from '../dataService';

jest.mock('../../../_shared/services/dBService');

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
	describe('#addUserTransaction', () => {
		test('should create a new user with email', async () => {
			// @ts-ignore
			runInsertQuery.mockResolvedValueOnce([{ id: 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77' }]);
			// @ts-ignore
			runQuery.mockResolvedValueOnce({ id: 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77' });

			const transaction = addUserTransaction('test@test.com');
			const results = await transaction(entityManager);

			// @ts-ignore
			runQuery.mockRestore();
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
				// @ts-ignore
				runQuery.mockRestore();
				done();
			});
		});
	});

	describe('#checkUserVerificationCode', () => {
		test('should return true if code and id matches', async () => {
			// @ts-ignore
			runQuery.mockResolvedValueOnce(1);
			const data = { id: '5738', verificationCode: '3452' };
			const results = await checkUserVerificationCode(data);
			// @ts-ignore
			runQuery.mockRestore();
			expect(results).toBeTruthy();
		});

		test('should throw if id is empty', (done) => {
			const data = { id: '', verificationCode: '3452' };
			checkUserVerificationCode(data).catch((error) => {
				expect(error.message).toBe('user id and verification code are required');
				expect(runQuery).not.toHaveBeenCalled();
				done();
			});
		});

		test('should throw if verificationCode is empty', (done) => {
			const data = { id: '380284', verificationCode: '' };
			checkUserVerificationCode(data).catch((error) => {
				expect(error.message).toBe('user id and verification code are required');
				expect(runQuery).not.toHaveBeenCalled();
				done();
			});
		});

		test('should throw if runQuery returns 0', (done) => {
			// @ts-ignore
			runQuery.mockResolvedValueOnce(0);
			const data = { id: '5738', verificationCode: '3452' };
			checkUserVerificationCode(data).catch((error) => {
				expect(error.message).toBe('invalid verification code');
				// @ts-ignore
				runQuery.mockRestore();
				done();
			});
		});
	});
});
