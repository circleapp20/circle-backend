import { compareSync } from 'bcryptjs';
import { runInsertQuery, runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import {
	addUserTransaction,
	checkUserVerificationCode,
	createUserProfileWithDefaultValues,
	getUserProfileById,
	verifyUserLoginCredentials
} from '../dataService';
import * as queryBuilder from '../queryBuilder';

jest.mock('../../../_shared/services/dBService');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92'),
	compareSync: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
	describe('#addUserTransaction', () => {
		const addMock = jest.spyOn(queryBuilder, 'addUserProfileQuery');
		addMock.mockImplementation();

		test('should create user with email', async () => {
			(runInsertQuery.mockImplementationOnce as any)((callBack: any, data: any) => {
				callBack(entityManager, data);
				return [{ id: 'x7i9-3l-n3k4-3i8bi2' }];
			});

			const transaction = addUserTransaction('test@test.com');
			await transaction(entityManager);

			expect(addMock).toHaveBeenCalled();
		});

		test('should create user with phoneNumber', async () => {
			(runInsertQuery.mockImplementationOnce as any)((callBack: any, data: any) => {
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
			(runInTransaction.mockResolvedValueOnce as any)({ id: 'x7i9-3l-n3k4-3i8bi2' });
			await createUserProfileWithDefaultValues({ email: 'test@test.com' });
			expect(runQuery).toHaveBeenCalled();
			expect(runInTransaction).toHaveBeenCalled();
		});

		test('should throw an error if user already exists', (done) => {
			(runQuery.mockReturnValueOnce as any)({ id: 'x7i9-3l-n3k4-3i8bi2' });
			createUserProfileWithDefaultValues({ email: 'test@test.com' }).catch((error) => {
				expect(error.message).toBe('User already exists');
				expect(error.status).toBe(400);
				(runQuery.mockRestore as any)();
				done();
			});
		});
	});

	describe('#checkUserVerificationCode', () => {
		test('should return true if code and id matches', async () => {
			(runQuery.mockResolvedValueOnce as any)(1);
			const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '3452' };
			const results = await checkUserVerificationCode(data);
			(runQuery.mockRestore as any)();
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
			(runQuery.mockResolvedValueOnce as any)(0);
			const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '3452' };
			checkUserVerificationCode(data).catch((error) => {
				expect(error.message).toBe('invalid verification code');
				(runQuery.mockRestore as any)();
				done();
			});
		});
	});

	describe('#verifyUserLoginCredentials', () => {
		test('should throw error if username, email and phoneNumber is null', (done) => {
			verifyUserLoginCredentials({
				password: 'jellybean',
				email: '',
				phoneNumber: '',
				username: ''
			}).catch((error) => {
				expect(error.message).toBe('phoneNumber, email or username is required');
				done();
			});
		});

		test('should throw if there is no password', (done) => {
			verifyUserLoginCredentials({
				password: '',
				email: 'test@test.com',
				phoneNumber: '',
				username: ''
			}).catch((error) => {
				expect(error.message).toBe('password is required');
				done();
			});
		});

		test('should throw error if user is not found', (done) => {
			(runQuery.mockResolvedValueOnce as any)(null);
			verifyUserLoginCredentials({
				password: 'testing',
				email: 'test@test.com',
				phoneNumber: '',
				username: 'tester'
			}).catch((error) => {
				expect(error.message).toBe('Invalid user account');
				done();
			});
		});

		test('should throw error if password does not match', (done) => {
			(compareSync as any).mockReturnValueOnce(false);
			(runQuery.mockResolvedValueOnce as any)({ password: '$9j9h48v3ge92' });
			verifyUserLoginCredentials({
				password: 'testing',
				email: 'test@test.com',
				phoneNumber: '',
				username: 'tester'
			}).catch((error) => {
				expect(error.message).toBe('Invalid user account');
				done();
			});
		});

		test('should return user details with token', (done) => {
			(compareSync as any).mockReturnValueOnce(true);
			(runQuery.mockResolvedValueOnce as any)({
				password: '$9j9h48v3ge92',
				id: 'x7i9-3l-n3k4-3i8bi2'
			});
			verifyUserLoginCredentials({
				password: 'testing',
				email: 'test@test.com',
				phoneNumber: '',
				username: 'tester'
			}).then((user) => {
				expect(user.id).toBe('x7i9-3l-n3k4-3i8bi2');
				expect(user.token).toBeDefined();
				done();
			});
		});
	});

	describe('#getUserProfileById', () => {
		test('should call getUserByIdQuery with the user id', async () => {
			(runQuery.mockResolvedValueOnce as any)({ id: 'x39-39ng39-nf39' });
			await getUserProfileById('x39-39ng39-nf39');
			expect(runQuery).toHaveBeenCalledWith(
				expect.any(Function),
				expect.arrayContaining(['x39-39ng39-nf39'])
			);
		});

		test('should throw error if user does not exists', (done) => {
			(runQuery.mockResolvedValueOnce as any)(null);
			getUserProfileById('x39-39ng39-nf39').catch((error) => {
				expect(error.message).toBe('Invalid user account');
				done();
			});
		});
	});
});
