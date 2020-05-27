import { runQuery } from '../../../_shared/services/dBService';
import { verifyUserCredentials } from '../authControllers';
import { sendVerificationCodeByEmail } from '../authService';
import * as service from '../dataService';

jest.mock('typeorm');
jest.mock('../../../_shared/services/dBService');
jest.mock('../../../_shared/services/schemaService');
jest.mock('../authService');

beforeEach(() => jest.clearAllMocks());

describe('#authControllers', () => {
	describe('#verifyUserCredentials', () => {
		const requestMock: any = { body: { data: { email: 'test@test.com' } } };
		const responseMock: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};

		test('should create a new user', async () => {
			await verifyUserCredentials(requestMock, responseMock);

			expect(responseMock.status).toHaveBeenCalledWith(201);
		});

		test('should not create a user if exists', (done) => {
			// @ts-ignore
			runQuery.mockReturnValueOnce({ id: '9383iwe382' });
			verifyUserCredentials(requestMock, responseMock).catch(({ message }) => {
				expect(responseMock.status).not.toHaveBeenCalled();
				expect(message).toBe('User already exists');
				done();
			});
		});

		test('should send email', async () => {
			const createMock = jest.spyOn(service, 'createUserProfileWithDefaultValues');
			createMock.mockImplementation().mockResolvedValueOnce({
				id: '393029',
				verificationCode: '89ej5',
				email: 'test@test.com'
			} as any);

			await verifyUserCredentials(requestMock, responseMock);
			expect(sendVerificationCodeByEmail).toHaveBeenCalledWith('89ej5', 'test@test.com');
			createMock.mockRestore();
		});
	});
});
