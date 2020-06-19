import bcryptjs from 'bcryptjs';
import {
	checkUsernameOrEmailExists,
	updateUserPassword,
	updateUserProfile,
	updateUserTransaction
} from 'feature/users/node/dataService';
import * as queryBuilder from 'feature/users/node/queries';
import { IUpdateUserProfile } from 'feature/users/types';
import { runQuery } from 'shared/node/database';
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

describe('#updateUserTransaction', () => {
	test('should update a user profile', async () => {
		(runQuery.mockImplementationOnce as any)((callBack: any, values: any) => {
			return callBack(entityManager, values);
		});

		const updateMock = jest.spyOn(queryBuilder, 'updateUserProfileQuery');
		updateMock.mockImplementation();

		const values: IUpdateUserProfile = {
			biography: '',
			dob: new Date(),
			id: 'x7i9-3l-n3k4-3i8bi2',
			image: '',
			password: '',
			username: '',
			email: '',
			phoneNumber: '',
			name: ''
		};

		const transaction = updateUserTransaction(values);
		await transaction(entityManager);

		// ensure that the same values are not passed to query builder
		// especially for the password, cause it is hashed by bcryptjs
		expect(updateMock).not.toHaveBeenCalledWith(entityManager, values);
		updateMock.mockRestore();

		expect(runQuery).toHaveBeenCalledTimes(2);
	});
});

describe('#updateUserProfile', () => {
	const values: IUpdateUserProfile = {
		biography: '',
		dob: new Date(),
		id: 'x7i9-3l-n3k4-3i8bi2',
		image: '',
		password: 'password',
		username: '',
		email: '',
		phoneNumber: '',
		name: ''
	};

	test('should update profile with valid details', async () => {
		(<any>runQuery).mockResolvedValueOnce(1);
		(<any>runQuery).mockResolvedValueOnce(true); // updateUserProfileQuery
		(<any>runQuery).mockResolvedValueOnce(values);
		const user = await updateUserProfile(values);
		expect(user).toBeDefined();
	});

	test('should throw error if username already exists', (done) => {
		(runQuery.mockResolvedValueOnce as any)(2);
		updateUserProfile(values).catch((error) => {
			expect(error.message).toBe('username already exists');
			done();
		});
	});

	test('should throw error if id is invalid', (done) => {
		const data = Object.assign({}, values, { id: '' });
		updateUserProfile(data).catch((error) => {
			expect(error.message).toBe('id is required');
			done();
		});
	});

	test('should throw error if password is invalid', (done) => {
		const data = Object.assign({}, values, { password: '' });
		updateUserProfile(data).catch((error) => {
			expect(error.message).toBe('password is required');
			done();
		});
	});

	test('should throw error if another user has the same email', (done) => {
		(<any>runQuery).mockResolvedValueOnce(1);
		(<any>runQuery).mockResolvedValueOnce(2);
		const data = Object.assign({}, values, { email: 'testing@test.com' });
		updateUserProfile(data).catch((error) => {
			expect(error.message).toBe('email already exists');
			done();
		});
	});

	test('should throw error if phone number already exists', (done) => {
		(<any>runQuery).mockResolvedValueOnce(1);
		(<any>runQuery).mockResolvedValueOnce(2);
		const data = Object.assign({}, values, { phoneNumber: '555-555-5555' });
		updateUserProfile(data).catch((error) => {
			expect(error.message).toBe('phone number already exists');
			done();
		});
	});
});

describe('#checkUsernameOrEmailExists', () => {
	test('should return false for username if does not exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(0);
		const result = await checkUsernameOrEmailExists('username', '');
		expect(result.username).toBeFalsy();
	});

	test('should return true for username if exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(1);
		const result = await checkUsernameOrEmailExists('username', '');
		expect(result.username).toBeTruthy();
	});

	test('should return false if email does not exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(0);
		const result = await checkUsernameOrEmailExists('', 'test@test.com');
		expect(result.email).toBeFalsy();
	});

	test('should return true if email does exists', async () => {
		(runQuery.mockResolvedValueOnce as any)(1);
		const result = await checkUsernameOrEmailExists('', 'test@test.com');
		expect(result.email).toBeTruthy();
	});

	test('should return an object containing email and username', async () => {
		const result = await checkUsernameOrEmailExists('', 'test@test.com');
		expect(result).toEqual(
			expect.objectContaining({
				username: expect.any(Boolean),
				email: expect.any(Boolean)
			})
		);
	});
});

describe('#updateUserPassword', () => {
	beforeEach(() => {
		(<any>runQuery).mockResolvedValue({ id: 'xi93m', password: '2f3n92' });
		(bcryptjs as any).compareSync.mockReturnValue(false);
	});

	test('should throw error if user does not exists', (done) => {
		(<any>runQuery).mockResolvedValueOnce(null);
		updateUserPassword('xi93xm', 'testing').catch((error) => {
			expect(error.message).toBe('Invalid user account');
			done();
		});
	});

	test('should throw error if password matches old password', (done) => {
		(bcryptjs as any).compareSync.mockReturnValueOnce(true);
		updateUserPassword('xi93m', 'testing').catch((error) => {
			expect(error.message).toBe('Cannot enter the same password');
			done();
		});
	});

	test('should hash the new password', async () => {
		await updateUserPassword('xi93m', 'testing');
		expect(bcryptjs.hashSync).toHaveBeenCalledWith(
			expect.stringMatching('testing'),
			expect.any(Number)
		);
	});

	test('should update user password', async () => {
		await updateUserPassword('xi93m', 'testing');
		expect(runQuery).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					password: expect.any(String)
				})
			])
		);
	});
});
