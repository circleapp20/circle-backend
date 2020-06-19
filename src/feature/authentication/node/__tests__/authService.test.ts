import bcryptjs from 'bcryptjs';
import * as dataService from 'feature/authentication/node/authService';
import { createUserFixture } from 'fixtures/users';
import * as utils from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import { runQuery } from 'shared/node/database';
import * as encryption from 'shared/node/encryption';
import * as sharedQueries from 'shared/node/queries';
import { entityManager } from 'shared/testUtils/node/entityManager';

jest.mock('shared/node/database');
jest.mock('shared/common/schema/users');
jest.mock('shared/common/schema/fellows');
jest.mock('shared/common/schema/locations');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92'),
	compareSync: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#addUserTransaction', () => {
	const addUserQuerySpy = jest.spyOn(sharedQueries, 'addUserProfileQuery');
	let createUserTransaction: (manager: any) => Promise<any>;

	beforeEach(() => {
		entityManager.execute.mockReturnValueOnce({
			generateMaps: [{ id: 'x7i9-3l-n3k4-3i8bi2' }]
		});
		createUserTransaction = dataService.addUserTransaction('test@test.com');
	});

	test('should create user with email', async () => {
		await createUserTransaction(entityManager);
		expect(addUserQuerySpy).toHaveBeenCalled();
	});

	test('should create user with phoneNumber', async () => {
		const transaction = dataService.addUserTransaction('', '+2339874563');
		await transaction(entityManager);
		expect(addUserQuerySpy).toHaveBeenCalled();
	});

	test('should generate random code for verification', async () => {
		const spy = jest.spyOn(utils, 'generateCodeFromNumber');
		await createUserTransaction(entityManager);
		expect(spy).toHaveBeenCalledWith();
	});

	test('should encrypt verification code', async () => {
		const spy = jest.spyOn(encryption, 'encryptData');
		await createUserTransaction(entityManager);
		expect(spy).toHaveBeenCalledWith(expect.objectContaining({ text: expect.any(String) }));
	});

	test('should add the user with the default profile', async () => {
		await createUserTransaction(entityManager);
		expect(addUserQuerySpy).toHaveBeenCalledWith(
			entityManager,
			expect.objectContaining({
				username: '',
				password: '',
				email: expect.stringMatching('test@test.com'),
				phoneNumber: '',
				roles: expect.arrayContaining([Constants.privileges.USER]),
				verificationCode: expect.any(String)
			})
		);
	});

	test('should return the added user', async () => {
		const getUserQuerySpy = jest.spyOn(sharedQueries, 'getUserByIdQuery');
		await createUserTransaction(entityManager);
		expect(getUserQuerySpy).toHaveBeenCalledWith(entityManager, 'x7i9-3l-n3k4-3i8bi2');
	});

	test('should return the new user profile', async () => {
		entityManager.getOne.mockReturnValueOnce({
			id: 'x7i9-3l-n3k4-3i8bi2',
			verificationCode: '$$20yy39nv93n932n92093nf92',
			phoneNumber: '',
			email: 'test@test.com',
			roles: ['user']
		});
		const results = await createUserTransaction(entityManager);
		expect(results).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				email: expect.stringMatching('test@test.com'),
				phoneNumber: '',
				roles: expect.arrayContaining([Constants.privileges.USER]),
				verificationCode: expect.any(String)
			})
		);
	});
});

describe('#checkUserVerificationCode', () => {
	test('should return true if code and id matches', async () => {
		const user = createUserFixture();
		entityManager.getOne.mockReturnValueOnce({
			...user,
			verificationCode: encryption.encryptData({ text: '345287' })
		});
		const data = { id: user.id, verificationCode: '345287' };
		const results = await dataService.checkUserVerificationCode(data);
		expect(results).toBeTruthy();
	});

	test('should throw if id is empty', () => {
		const data = { id: '', verificationCode: '3452' };
		expect(dataService.checkUserVerificationCode(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw if verificationCode is empty', () => {
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '' };
		expect(dataService.checkUserVerificationCode(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw if user is null', () => {
		entityManager.getOne.mockReturnValueOnce(null);
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '345287' };
		expect(dataService.checkUserVerificationCode(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should decrypt stored encrypted verification code', async () => {
		const user = createUserFixture();
		entityManager.getOne.mockReturnValueOnce({
			...user,
			verificationCode: encryption.encryptData({ text: '345287' })
		});
		const spy = jest.spyOn(encryption, 'decryptData');
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '345287' };
		await dataService.checkUserVerificationCode(data);
		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({ encryptedText: expect.any(String) })
		);
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
		(<any>bcryptjs).compareSync.mockReturnValueOnce(false);
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
		(<any>bcryptjs).compareSync.mockReturnValueOnce(true);
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
		const user = createUserFixture();
		const verificationCode = encryption.encryptData({ text: '783465' });
		entityManager.getOne.mockReturnValueOnce(Object.assign(user, { verificationCode }));
		await dataService.getUserProfileById(user.id);
		expect(runQuery).toHaveBeenCalledWith(
			expect.any(Function),
			expect.arrayContaining([user.id])
		);
	});

	test('should throw error if user does not exists', () => {
		entityManager.getOne.mockReturnValueOnce(null);
		expect(
			dataService.getUserProfileById('x39-39ng39-nf39')
		).rejects.toThrowErrorMatchingSnapshot();
	});
});

describe('#getUserAccountWithCredentials', () => {
	const userProfile = createUserFixture();
	const credentials = {
		username: userProfile.username,
		phoneNumber: userProfile.phoneNumber,
		email: userProfile.email
	};

	beforeAll(() => {
		const verificationCode = encryption.encryptData({ text: '123456' });
		Object.assign(userProfile, { verificationCode });
	});

	test('should throw if user is not found', () => {
		entityManager.getOne.mockReturnValueOnce(null);
		expect(
			dataService.getUserAccountWithCredentials(credentials)
		).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should add token to the return object', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		const user = await dataService.getUserAccountWithCredentials(credentials);
		expect(user.token).toEqual(expect.any(String));
	});

	test('should not return the password', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		const user = await dataService.getUserAccountWithCredentials(credentials);
		expect(user).not.toHaveProperty('password');
	});

	test('should update user with new verification code', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
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

	test('should create new verification code', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		const spy = jest.spyOn(utils, 'generateCodeFromNumber');
		await dataService.getUserAccountWithCredentials(credentials);
		expect(spy).toHaveReturnedWith(expect.any(String));
	});

	test('should encrypt the verification code', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		const spy = jest.spyOn(utils, 'generateCodeFromNumber');
		spy.mockReturnValueOnce('678902');
		await dataService.getUserAccountWithCredentials(credentials);
		expect(runQuery).toHaveBeenNthCalledWith(
			2,
			expect.any(Function),
			expect.arrayContaining([
				{ id: userProfile.id, verificationCode: expect.not.stringMatching('678902') }
			])
		);
	});
});

describe('#createUserProfileWithDefaultValues', () => {
	const profile = createUserFixture();

	test('should add user if email does not exists', async () => {
		entityManager.getOne.mockReturnValueOnce(null).mockReturnValueOnce(profile);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [profile] });
		const user = await dataService.createUserProfileWithDefaultValues({
			email: profile.email
		});
		expect(user).toEqual(
			expect.objectContaining({
				...profile,
				token: expect.any(String)
			})
		);
	});

	test('should create new user if phoneNumber does not exists', async () => {
		entityManager.getOne.mockReturnValueOnce(null).mockReturnValueOnce(profile);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [profile] });
		const user = await dataService.createUserProfileWithDefaultValues({
			phoneNumber: profile.phoneNumber
		});
		expect(user).toEqual(
			expect.objectContaining({
				...profile,
				token: expect.any(String)
			})
		);
	});

	test('should throw an error if email already exists', () => {
		entityManager.getOne.mockReturnValueOnce(profile);
		expect(
			dataService.createUserProfileWithDefaultValues({ email: 'test@test.com' })
		).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw bad request error if phone number already exists', () => {
		entityManager.getOne.mockReturnValueOnce(profile);
		expect(
			dataService.createUserProfileWithDefaultValues({ email: '+2339954853' })
		).rejects.toThrowErrorMatchingSnapshot();
	});
});
