import { entityManagerMock as manager } from '../../../__testSetup__';
import { Constants } from '../../constants';
import { getSqlInstance, runInsertQuery, runInTransaction, runQuery } from '../dBService';
import { Users } from '../schemaService';
import {
	addUserAsSuperAdmin,
	checkDatabaseExistsQuery,
	checkIfDataBaseExists,
	countExistingSuperAdminQuery,
	createCircleSuperAdmin,
	createDBSchema,
	setupCircleDatabase
} from '../storageService';

jest.mock('../schemaService');
jest.mock('../dBService');

beforeEach(() => jest.clearAllMocks());

describe('#storageService', () => {
	describe('#checkDatabaseExistsQuery', () => {
		test('should create query using the Users table', async () => {
			await checkDatabaseExistsQuery(manager);
			expect(manager.createQueryBuilder).toHaveBeenCalledWith(Users, 'users');
		});

		test('should limit the search to only 1', async () => {
			await checkDatabaseExistsQuery(manager);
			expect(manager.limit).toHaveBeenCalledWith(1);
		});
	});

	describe('#checkIfDataBaseExists', () => {
		test('should return true if runQuery resolves successfully', async () => {
			const exists = await checkIfDataBaseExists();
			expect(exists).toBeTruthy();
		});

		test('should return false if runQuery rejects', async () => {
			runQuery.mockRejectedValueOnce(new Error());
			const exists = await checkIfDataBaseExists();
			expect(exists).toBeFalsy();
		});
	});

	describe('#createDBSchema', () => {
		test('should not create database schema if exists', async () => {
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'exists', success: true });
		});

		test('should create the database schema', async () => {
			runQuery.mockRejectedValueOnce(new Error());
			(getSqlInstance as any).mockResolvedValueOnce({ close: jest.fn() });
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'created', success: true });
		});

		test('should fail if synchronization fails', async () => {
			runQuery.mockRejectedValueOnce(new Error());
			(getSqlInstance as any).mockRejectedValueOnce(new Error());
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'failed', success: false });
		});
	});

	describe('#countExistingSuperAdminQuery', () => {
		test('should create a query builder with an alias of u for Users', async () => {
			await countExistingSuperAdminQuery(manager);
			expect(manager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
		});

		test('should search user roles that contains super admin privilege', async () => {
			await countExistingSuperAdminQuery(manager);
			expect(manager.where).toHaveBeenCalledWith('u.roles LIKE :role');
		});

		test('should set roles parameter with super admin privileges', async () => {
			await countExistingSuperAdminQuery(manager);
			expect(manager.setParameter).toHaveBeenCalledWith(
				'role',
				`%${Constants.privileges.SUPER_ADMIN}%`
			);
		});

		test('should get the total count of super admins', async () => {
			await countExistingSuperAdminQuery(manager);
			expect(manager.getCount).toHaveBeenCalled();
		});
	});

	describe('#addUserAsSuperAdmin', () => {
		test('should call the runInsertQuery with the profile of the super admin', async () => {
			await addUserAsSuperAdmin(manager);
			expect(runInsertQuery).toHaveBeenCalledWith(
				expect.any(Function),
				expect.arrayContaining([
					expect.objectContaining({
						biography: expect.any(String),
						dob: expect.any(Date),
						email: expect.any(String),
						image: expect.any(String),
						isEmailVerified: true,
						name: expect.any(String),
						password: expect.any(String),
						phoneNumber: expect.any(String),
						roles: expect.arrayContaining([
							Constants.privileges.SUPER_ADMIN,
							Constants.privileges.USER
						]),
						username: expect.any(String),
						verificationCode: expect.any(String)
					})
				]),
				manager
			);
		});
	});

	describe('#createCircleSuperAdmin', () => {
		test('should create a super admin if no super exists', async () => {
			runQuery.mockResolvedValueOnce(0);
			await createCircleSuperAdmin();
			expect(runInTransaction).toHaveBeenCalledWith(expect.any(Function));
		});

		test('should not create super admin if at least one exists', async () => {
			runQuery.mockResolvedValueOnce(1);
			await createCircleSuperAdmin();
			expect(runInTransaction).not.toHaveBeenCalled();
		});
	});

	describe('#setupCircleDatabase', () => {
		test('should create super admin after creating the database', async () => {
			await setupCircleDatabase();
			expect(runInTransaction).toHaveBeenCalled();
		});

		test('should not create super admin if database failed to setup', async () => {
			runQuery.mockRejectedValueOnce(new Error());
			(getSqlInstance as any).mockRejectedValueOnce(new Error());
			await setupCircleDatabase();
			expect(runInTransaction).not.toHaveBeenCalled();
		});
	});
});
