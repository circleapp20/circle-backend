import { entityManager } from 'base/testUtils/node/entityManager';
import * as utils from 'base/utils/node/codeGenerator';
import bcryptjs from 'bcryptjs';
import { runQuery } from 'core/database/queryRunners';
import * as encryption from 'core/encryption/node/encryption';
import {
	checkUserVerificationCode,
	getUserAccountWithCredentials,
	verifyUserLoginCredentials
} from 'feature/authentication/services/node/verifyUserCredentialsService';
import { createUserFixture } from 'fixtures/users';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/users');
jest.mock('core/models/node/fellows');

beforeEach(() => jest.clearAllMocks());

describe('#checkUserVerificationCode', () => {
	test('should return true if code and id matches', async () => {
		const user = createUserFixture();
		entityManager.getOne.mockReturnValueOnce({
			...user,
			verificationCode: encryption.encryptData({ text: '345287' })
		});
		const data = { id: user.id, verificationCode: '345287' };
		const results = await checkUserVerificationCode(data);
		expect(results).toBeTruthy();
	});

	test('should throw if id is empty', () => {
		const data = { id: '', verificationCode: '3452' };
		expect(checkUserVerificationCode(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw if verificationCode is empty', () => {
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '' };
		expect(checkUserVerificationCode(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw if user is null', () => {
		entityManager.getOne.mockReturnValueOnce(null);
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '345287' };
		expect(checkUserVerificationCode(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should decrypt stored encrypted verification code', async () => {
		const user = createUserFixture();
		entityManager.getOne.mockReturnValueOnce({
			...user,
			verificationCode: encryption.encryptData({ text: '345287' })
		});
		const spy = jest.spyOn(encryption, 'decryptData');
		const data = { id: 'x7i9-3l-n3k4-3i8bi2', verificationCode: '345287' };
		await checkUserVerificationCode(data);
		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({ encryptedText: expect.any(String) })
		);
	});
});

describe('#verifyUserLoginCredentials', () => {
	const spy = jest.spyOn(bcryptjs, 'compareSync');

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

	test('should throw error if password does not match', () => {
		spy.mockReturnValueOnce(false);
		entityManager.getOne.mockReturnValueOnce(createUserFixture());
		const credentials = {
			password: 'testing',
			email: 'test@test.com',
			phoneNumber: '',
			username: 'tester'
		};
		expect(verifyUserLoginCredentials(credentials)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should return user details with token', async () => {
		spy.mockReturnValueOnce(true);
		const user = createUserFixture();
		entityManager.getOne.mockReturnValueOnce(user);
		const value = await verifyUserLoginCredentials({
			password: user.password,
			email: user.email,
			phoneNumber: '',
			username: user.username
		});
		expect(value).toEqual(expect.objectContaining({ token: expect.any(String) }));
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
		expect(getUserAccountWithCredentials(credentials)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should add token to the return object', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		const user = await getUserAccountWithCredentials(credentials);
		expect(user.token).toEqual(expect.any(String));
	});

	test('should not return the password', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		const user = await getUserAccountWithCredentials(credentials);
		expect(user).not.toHaveProperty('password');
	});

	test('should update user with new verification code', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		await getUserAccountWithCredentials(credentials);
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
		await getUserAccountWithCredentials(credentials);
		expect(spy).toHaveReturnedWith(expect.any(String));
	});

	test('should encrypt the verification code', async () => {
		entityManager.getOne.mockReturnValueOnce(userProfile);
		const spy = jest.spyOn(utils, 'generateCodeFromNumber');
		spy.mockReturnValueOnce('678902');
		await getUserAccountWithCredentials(credentials);
		expect(runQuery).toHaveBeenNthCalledWith(
			2,
			expect.any(Function),
			expect.arrayContaining([
				{ id: userProfile.id, verificationCode: expect.not.stringMatching('678902') }
			])
		);
	});
});
