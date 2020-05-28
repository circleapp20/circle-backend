import { runInTransaction, runQuery } from '../../../_shared/services/dBService';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { updateUserProfile, updateUserTransaction } from '../dataService';
import * as queryBuilder from '../queryBuilder';
import { IUpdateUserProfile } from '../_helpers/types';

jest.mock('../../../_shared/services/dBService');
jest.mock('bcryptjs', () => ({
	hashSync: jest.fn().mockReturnValue('$$20yy39nv93n932n92093nf92')
}));

beforeEach(() => jest.clearAllMocks());

describe('#dataService', () => {
	describe('#updateUserTransaction', () => {
		test('should update a user profile', async () => {
			// @ts-ignore
			runQuery.mockImplementationOnce((callBack, values) => {
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
			// @ts-ignore
			runQuery.mockResolvedValueOnce(0);

			// @ts-ignore
			runInTransaction.mockImplementation(jest.fn()).mockResolvedValueOnce({
				id: ''
			});

			const user = await updateUserProfile(values);
			expect(user).toBeDefined();
		});

		test('should throw error if username already exists', (done) => {
			// @ts-ignore
			runQuery.mockResolvedValueOnce(1);
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
});
