import { runInsertQuery, runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import {
	addUserTransaction,
	checkUserVerificationCode,
	createUserProfileWithDefaultValues
} from '../dataService';
import * as queryBuilder from '../queryBuilder';

jest.mock('../../../_shared/services/dBService');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92')
}));

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
	describe('#addUserTransaction', () => {
		const addMock = jest.spyOn(queryBuilder, 'addUserProfileQuery');
		addMock.mockImplementation();

		test('should create user with email', async () => {
			// @ts-ignore
			runInsertQuery.mockImplementationOnce((callBack, data) => {
				callBack(entityManager, data);
				return [{ id: 'x7i9-3l-n3k4-3i8bi2' }];
			});

			const transaction = addUserTransaction('test@test.com');
			await transaction(entityManager);

			expect(addMock).toHaveBeenCalled();
		});

		test('should create user with phoneNumber', async () => {
			// @ts-ignore
			runInsertQuery.mockImplementationOnce((callBack, data) => {
				callBack(entityManager, data);
				return [{ id: 'x7i9-3l-n3k4-3i8bi2' }];
			});

			const transaction = addUserTransaction('', '+2339874563');
			await transaction(entityManager);

			expect(addMock).toHaveBeenCalled();
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
			runQuery.mockReturnValueOnce({ id: 'x7i9-3l-n3k4-3i8bi2' });
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
			const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '3452' };
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
			const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '' };
			checkUserVerificationCode(data).catch((error) => {
				expect(error.message).toBe('user id and verification code are required');
				expect(runQuery).not.toHaveBeenCalled();
				done();
			});
		});

		test('should throw if runQuery returns 0', (done) => {
			// @ts-ignore
			runQuery.mockResolvedValueOnce(0);
			const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '3452' };
			checkUserVerificationCode(data).catch((error) => {
				expect(error.message).toBe('invalid verification code');

				// @ts-ignore
				runQuery.mockRestore();
				done();
			});
		});
	});
});
