import * as utils from 'base/common/utilities';
import { Constants } from 'base/constants';
import * as sharedQueries from 'base/node/queries';
import { entityManager } from 'base/testUtils/node/entityManager';
import * as encryption from 'core/node/encryption';
import faker from 'faker';
import { createUserFixture } from 'fixtures/users';
import {
	addUserTransaction,
	createUserProfileWithDefaultValues
} from '../createUserProfileService';

jest.mock('core/node/database/queryRunners');
jest.mock('base/common/schema/users');
jest.mock('base/common/schema/fellows');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92'),
	compareSync: jest.fn()
}));

describe('#addUserTransaction', () => {
	const addUserQuerySpy = jest.spyOn(sharedQueries, 'addUserProfileQuery');
	let createUserTransaction: (manager: any) => Promise<any>;

	beforeEach(() => {
		entityManager.execute.mockReturnValueOnce({
			generateMaps: [{ id: 'x7i9-3l-n3k4-3i8bi2' }]
		});
		createUserTransaction = addUserTransaction('test@test.com');
	});

	test('should create user with email', async () => {
		await createUserTransaction(entityManager);
		expect(addUserQuerySpy).toHaveBeenCalled();
	});

	test('should create user with phoneNumber', async () => {
		const transaction = addUserTransaction('', '+2339874563');
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

describe('#createUserProfileWithDefaultValues', () => {
	const verificationCode = encryption.encryptData({ text: faker.random.alphaNumeric() });
	const profile = { ...createUserFixture(), verificationCode };

	test('should add user if email does not exists', async () => {
		entityManager.getOne.mockReturnValueOnce(null).mockReturnValueOnce(profile);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [profile] });
		const user = await createUserProfileWithDefaultValues({ email: profile.email });
		expect(user).toEqual(expect.objectContaining({ token: expect.any(String) }));
	});

	test('should create new user if phoneNumber does not exists', async () => {
		entityManager.getOne.mockReturnValueOnce(null).mockReturnValueOnce(profile);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [profile] });
		const user = await createUserProfileWithDefaultValues({
			phoneNumber: profile.phoneNumber
		});
		expect(user).toEqual(expect.objectContaining({ token: expect.any(String) }));
	});

	test('should throw an error if email already exists', () => {
		entityManager.getOne.mockReturnValueOnce(profile);
		expect(
			createUserProfileWithDefaultValues({ email: 'test@test.com' })
		).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw bad request error if phone number already exists', () => {
		entityManager.getOne.mockReturnValueOnce(profile);
		expect(
			createUserProfileWithDefaultValues({ email: '+2339954853' })
		).rejects.toThrowErrorMatchingSnapshot();
	});
});
