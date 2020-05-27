import { getBadRequestError } from '../../../_shared/services';
import { runQuery } from '../../../_shared/services/dBService';
import { verifyUserCredentials, verifyUserVerificationCode } from '../authControllers';
import { sendVerificationCodeByEmail } from '../authService';
import * as service from '../dataService';

jest.mock('typeorm');
jest.mock('../../../_shared/services/dBService');
jest.mock('../../../_shared/services/schemaService');
jest.mock('../authService');

beforeEach(() => jest.clearAllMocks());

describe('#authControllers', () => {
	const responseMock: any = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis()
	};

	describe('#verifyUserCredentials', () => {
		const requestMock: any = { body: { data: { email: 'test@test.com' } } };

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
				// @ts-ignore
				runQuery.mockRestore();
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
			createMock.mockRestore();
			expect(sendVerificationCodeByEmail).toHaveBeenCalledWith('89ej5', 'test@test.com');
		});
	});

	describe('#verifyUserVerificationCode', () => {
		const requestMock: any = { body: { data: { id: '9384j', verificationCode: '9384k' } } };
		const verifyMock = jest.spyOn(service, 'checkUserVerificationCode');
		verifyMock.mockImplementation().mockResolvedValueOnce(true);

		test('should send a status of 201 with the json data', async () => {
			await verifyUserVerificationCode(requestMock, responseMock);
			verifyMock.mockRestore();
			expect(responseMock.status).toHaveBeenCalledWith(201);
			expect(responseMock.json).toHaveBeenCalledWith({
				data: true,
				success: true
			});
		});

		test('should throw when checkUserVerificationCode fails', (done) => {
			verifyMock.mockRejectedValueOnce(getBadRequestError('invalid verification code'));
			verifyUserVerificationCode(requestMock, responseMock).catch((error) => {
				verifyMock.mockRestore();
				expect(error.message).toBe('invalid verification code');
				done();
			});
		});
	});
});
