import { runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import {
	checkUsernameOrEmailExists,
	updateUserProfile,
	updateUserTransaction
} from '../dataService';
import * as queryBuilder from '../queryBuilder';
import { IUpdateUserProfile } from '../_helpers/types';

jest.mock('../../../_shared/services/dBService');
jest.mock('../../../_shared/services/schemaService');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92')
}));

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
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
				username: ''
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
			username: ''
		};

		test('should update profile with valid details', async () => {
			(runQuery.mockResolvedValueOnce as any)(0);
			(runInTransaction.mockImplementation as any)(jest.fn()).mockResolvedValueOnce({
				id: ''
			});

			const user = await updateUserProfile(values);
			expect(user).toBeDefined();
		});

		test('should throw error if username already exists', (done) => {
			(runQuery.mockResolvedValueOnce as any)(1);
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
});
