import { compareSync } from 'bcryptjs';
import * as dataService from 'feature/authentication/node/dataService';
import { Constants } from 'shared/constants';
import { runInsertQuery, runQuery } from 'shared/node/database';
import * as queries from 'shared/node/queries';
import { entityManager } from 'shared/testUtils/node/entityManager';

jest.mock('shared/node/schema');
jest.mock('shared/node/database');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92'),
	compareSync: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#addUserTransaction', () => {
	const addMock = jest.spyOn(queries, 'addUserProfileQuery');
	addMock.mockImplementation();

	test('should create user with email', async () => {
		(runInsertQuery.mockImplementationOnce as any)((callBack: any, data: any) => {
			callBack(entityManager, data);
			return [{ id: 'x7i9-3l-n3k4-3i8bi2' }];
		});

		const transaction = dataService.addUserTransaction('test@test.com');
		await transaction(entityManager);

		expect(addMock).toHaveBeenCalled();
	});

	test('should create user with phoneNumber', async () => {
		(runInsertQuery.mockImplementationOnce as any)((callBack: any, data: any) => {
			callBack(entityManager, data);
			return [{ id: 'x7i9-3l-n3k4-3i8bi2' }];
		});

		const transaction = dataService.addUserTransaction('', '+2339874563');
		await transaction(entityManager);

		expect(addMock).toHaveBeenCalled();
	});
});

describe('#checkUserVerificationCode', () => {
	test('should return true if code and id matches', async () => {
		(runQuery.mockResolvedValueOnce as any)(1);
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '3452' };
		const results = await dataService.checkUserVerificationCode(data);
		(runQuery.mockRestore as any)();
		expect(results).toBeTruthy();
	});

	test('should throw if id is empty', (done) => {
		const data = { id: '', verificationCode: '3452' };
		dataService.checkUserVerificationCode(data).catch((error) => {
			expect(error.message).toBe('user id and verification code are required');
			expect(runQuery).not.toHaveBeenCalled();
			done();
		});
	});

	test('should throw if verificationCode is empty', (done) => {
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '' };
		dataService.checkUserVerificationCode(data).catch((error) => {
			expect(error.message).toBe('user id and verification code are required');
			expect(runQuery).not.toHaveBeenCalled();
			done();
		});
	});

	test('should throw if runQuery returns 0', (done) => {
		(runQuery.mockResolvedValueOnce as any)(0);
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '3452' };
		dataService.checkUserVerificationCode(data).catch((error) => {
			expect(error.message).toBe('invalid verification code');
			(runQuery.mockRestore as any)();
			done();
		});
	});
});

describe('#verifyUserLoginCredentials', () => {
	test('should throw error if username, email and phoneNumber is null', (done) => {
		dataService
			.verifyUserLoginCredentials({
				password: 'jellybean',
				email: '',
				phoneNumber: '',
				username: ''
			})
			.catch((error) => {
				expect(error.message).toBe('phoneNumber, email or username is required');
				done();
			});
	});

	test('should throw if there is no password', (done) => {
		dataService
			.verifyUserLoginCredentials({
				password: '',
				email: 'test@test.com',
				phoneNumber: '',
				username: ''
			})
			.catch((error) => {
				expect(error.message).toBe('password is required');
				done();
			});
	});

	test('should throw error if user is not found', (done) => {
		(runQuery.mockResolvedValueOnce as any)(null);
		dataService
			.verifyUserLoginCredentials({
				password: 'testing',
				email: 'test@test.com',
				phoneNumber: '',
				username: 'tester'
			})
			.catch((error) => {
				expect(error.message).toBe('Invalid user account');
				done();
			});
	});

	test('should throw error if password does not match', (done) => {
		(compareSync as any).mockReturnValueOnce(false);
		(runQuery.mockResolvedValueOnce as any)({ password: '$9j9h48v3ge92' });
		dataService
			.verifyUserLoginCredentials({
				password: 'testing',
				email: 'test@test.com',
				phoneNumber: '',
				username: 'tester'
			})
			.catch((error) => {
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
		dataService
			.verifyUserLoginCredentials({
				password: 'testing',
				email: 'test@test.com',
				phoneNumber: '',
				username: 'tester'
			})
			.then((user) => {
				expect(user.id).toBe('x7i9-3l-n3k4-3i8bi2');
				expect(user.token).toBeDefined();
				done();
			});
	});
});
describe('#getUserProfileById', () => {
	test('should call getUserByIdQuery with the user id', async () => {
		(runQuery.mockResolvedValueOnce as any)({ id: 'x39-39ng39-nf39' });
		await dataService.getUserProfileById('x39-39ng39-nf39');
		expect(runQuery).toHaveBeenCalledWith(
			expect.any(Function),
			expect.arrayContaining(['x39-39ng39-nf39'])
		);
	});

	test('should throw error if user does not exists', (done) => {
		(runQuery.mockResolvedValueOnce as any)(null);
		dataService.getUserProfileById('x39-39ng39-nf39').catch((error) => {
			expect(error.message).toBe('Invalid user account');
			done();
		});
	});
});

describe('#getUserAccountWithCredentials', () => {
	const credentials = {
		username: 'tester',
		phoneNumber: '+2339456234',
		email: 'test@test.com'
	};
	const profile = {
		id: 'x7i9-3l-n3k4-3i8bi2',
		roles: [Constants.privileges.USER],
		password: '8292dj49dj2u'
	};

	test('should throw if user is not found', (done) => {
		(runQuery.mockResolvedValueOnce as any)(null);
		dataService.getUserAccountWithCredentials(credentials).catch((error) => {
			expect(error.message).toBe('Invalid user account');
			done();
		});
	});

	test('should add token to the return object', async () => {
		(runQuery.mockResolvedValueOnce as any)(profile);
		const user = await dataService.getUserAccountWithCredentials(credentials);
		expect(user.token).toEqual(expect.any(String));
	});

	test('should not return the password', async () => {
		(runQuery.mockResolvedValueOnce as any)(profile);
		const user = await dataService.getUserAccountWithCredentials(credentials);
		expect(user).not.toHaveProperty('password');
	});

	test('should update user with new verification code', async () => {
		(runQuery.mockResolvedValueOnce as any)(profile);
		await dataService.getUserAccountWithCredentials(credentials);
		expect(runQuery).toHaveBeenNthCalledWith(
			2,
			expect.any(Function),
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					verificationCode: expect.any(String)
				})
			])
		);
	});
});

describe('#createUserProfileWithDefaultValues', () => {
	const profile = {
		id: 'x7i9-3l-n3k4-3i8bi2',
		roles: ['user'],
		email: 'test@test.com',
		phoneNumber: '+2330102113',
		username: 'testing',
		verificationCode: '74ne7p'
	};

	test('should add user if email does not exists', async () => {
		(<any>runQuery).mockResolvedValueOnce(null);
		(<any>runQuery).mockResolvedValueOnce(profile);
		(<any>runInsertQuery).mockResolvedValueOnce([profile]);
		const user = await dataService.createUserProfileWithDefaultValues({
			email: 'test@test.com'
		});
		expect(user).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				roles: expect.arrayContaining([Constants.privileges.USER]),
				token: expect.any(String),
				email: expect.stringMatching('test@test.com'),
				phoneNumber: expect.any(String),
				username: expect.any(String),
				verificationCode: expect.any(String)
			})
		);
	});

	test('should create new user if phoneNumber does not exists', async () => {
		(<any>runQuery).mockResolvedValueOnce(null);
		(<any>runQuery).mockResolvedValueOnce(profile);
		(<any>runInsertQuery).mockResolvedValueOnce([profile]);
		const user = await dataService.createUserProfileWithDefaultValues({
			phoneNumber: '+2330102113'
		});
		expect(user).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				roles: expect.arrayContaining([Constants.privileges.USER]),
				token: expect.any(String),
				email: expect.any(String),
				phoneNumber: expect.any(String),
				username: expect.any(String),
				verificationCode: expect.any(String)
			})
		);
	});

	test('should throw an error if email already exists', (done) => {
		(runQuery.mockResolvedValueOnce as any)(profile);
		dataService
			.createUserProfileWithDefaultValues({ email: 'test@test.com' })
			.catch((error) => {
				expect(error.message).toBe('User already exists');
				expect(error.status).toBe(400);
				(runQuery.mockRestore as any)();
				done();
			});
	});

	test('should throw bad request error if phone number already exists', (done) => {
		(runQuery.mockResolvedValueOnce as any)(profile);
		dataService.createUserProfileWithDefaultValues({ email: '+2339954853' }).catch((error) => {
			expect(error.message).toBe('User already exists');
			expect(error.status).toBe(400);
			(runQuery.mockRestore as any)();
			done();
		});
	});
});
