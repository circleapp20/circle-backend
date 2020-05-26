import { entityManagerMock as manager } from '../../../__testSetup__';
import { getSqlInstance, runQuery } from '../dBService';
import { Users } from '../schemaService';
import * as service from '../storageService';
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
			// @ts-ignore
			runQuery.mockRejectedValueOnce(new Error());
			const exists = await checkIfDataBaseExists();
			expect(exists).toBeFalsy();
		});
	});

	describe('#createDBSchema', () => {
		beforeEach(() => {
			// @ts-ignore
			getSqlInstance.mockResolvedValue({
				close: jest.fn().mockResolvedValue(true)
			});
		});

		test('should create the database schema', async () => {
			const mockFn = jest.spyOn(service, 'checkIfDataBaseExists');
			mockFn.mockResolvedValueOnce(false);
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'created', success: true });
		});

		test('should not create database schema if exists', async () => {
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'exists', success: true });
		});

		test('should fail if synchronization fails', async () => {
			const mockFn = jest.spyOn(service, 'checkIfDataBaseExists');
			mockFn.mockRejectedValue(new Error());
			const results = await createDBSchema();
			expect(results).toEqual({ state: 'failed', success: false });
		});
	});
});
