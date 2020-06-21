import { entityManager } from 'base/testUtils/node/entityManager';
import bcryptjs from 'bcryptjs';
import { runQuery } from 'core/node/database/queryRunners';
import faker from 'faker';
import * as queries from 'feature/users/queries/updateUserQueries';
import { createUserFixture } from 'fixtures/users';
import {
	updateUserPassword,
	updateUserProfile,
	updateUserTransaction
} from '../updateUserProfileService';

jest.mock('core/node/database/queryRunners');
jest.mock('base/common/schema/users');
jest.mock('base/common/schema/fellows');
jest.mock('base/common/schema/locations');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92'),
	compareSync: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#updateUserTransaction', () => {
	let user: any, values: any, transaction: any;

	beforeAll(() => {
		user = createUserFixture();
		values = {
			...user,
			locationsId: Array.from(Array(2), faker.random.uuid)
		};
		transaction = updateUserTransaction(values);
	});

	test('should update a user profile', async () => {
		const updateMock = jest.spyOn(queries, 'updateUserProfileQuery');
		await transaction(entityManager);
		expect(updateMock).not.toHaveBeenCalledWith(entityManager, values);
	});

	test('should add locations to user', async () => {
		const spy = jest.spyOn(queries, 'addUserLocationsQuery');
		await transaction(entityManager);
		expect(spy).toHaveBeenCalledWith(entityManager, {
			locationsId: values.locationsId,
			id: user.id
		});
	});

	test("should not add locations to user if there aren't any", async () => {
		const spy = jest.spyOn(queries, 'addUserLocationsQuery');
		const runTransaction = updateUserTransaction(
			Object.assign({}, values, { locationsId: [] })
		);
		await runTransaction(entityManager);
		expect(spy).not.toHaveBeenCalled();
	});
});

describe('#updateUserProfile', () => {
	let user: any, values: any;

	beforeAll(() => {
		user = createUserFixture();
		values = {
			...user,
			locationsId: Array.from(Array(2), faker.random.uuid)
		};
	});

	test('should update profile with valid details', async () => {
		entityManager.getCount.mockReturnValueOnce(1).mockReturnValueOnce(1).mockReturnValueOnce(1);
		entityManager.execute.mockReturnValueOnce(true);
		entityManager.getOne.mockReturnValueOnce(values);
		const user = await updateUserProfile(values);
		expect(user).toBeDefined();
	});

	test('should throw error if username already exists', () => {
		(runQuery.mockResolvedValueOnce as any)(2);
		expect(updateUserProfile(values)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw error if id is invalid', () => {
		const data = Object.assign({}, values, { id: '' });
		expect(updateUserProfile(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw error if password is invalid', () => {
		const data = Object.assign({}, values, { password: '' });
		expect(updateUserProfile(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw error if phone number already exists', () => {
		entityManager.getCount.mockReturnValueOnce(1).mockReturnValueOnce(2);
		const data = Object.assign({}, values, { email: '' });
		expect(updateUserProfile(data)).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw error if another user has the same email', () => {
		entityManager.getCount.mockReturnValueOnce(1).mockReturnValueOnce(2);
		const data = Object.assign({}, values, { phoneNumber: '' });
		expect(updateUserProfile(data)).rejects.toThrowErrorMatchingSnapshot();
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
