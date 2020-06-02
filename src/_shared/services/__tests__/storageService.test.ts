import { entityManagerMock as manager } from '../../../__testSetup__';
import { getSqlInstance, runQuery } from '../dBService';
import { Users } from '../schemaService';
import { checkDatabaseExistsQuery, checkIfDataBaseExists, createDBSchema } from '../storageService';

jest.mock('../schemaService');
jest.mock('../dBService');

beforeEach(() => jest.clearAllMocks());

describe('#storageService', () => {
	describe('#checkDatabaseExistsQuery', () => {
		test('should call getCount from users table', async () => {
			await checkDatabaseExistsQuery(manager);
			expect(manager.getRepository).toBeCalledWith(Users);
			expect(manager.getCount).toBeCalled();
		});
	});

	describe('#checkIfDataBaseExists', () => {
		test('should return true if runQuery resolves successfully', async () => {
			const exists = await checkIfDataBaseExists();
			expect(exists).toBeTruthy();
		});

		test('should return false if runQuery rejects', async () => {
			(runQuery as any).mockRejectedValueOnce(new Error());
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
			(runQuery.mockRejectedValueOnce as any)(new Error());
			(getSqlInstance as any).mockResolvedValueOnce({ close: jest.fn() });
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'created', success: true });
		});

		test('should fail if synchronization fails', async () => {
			(runQuery.mockRejectedValueOnce as any)(new Error());
			(getSqlInstance as any).mockRejectedValueOnce(new Error());
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'failed', success: false });
		});
	});
});
