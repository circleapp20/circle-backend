import { Constants } from '../../../_shared/constants';
import { getBadRequestError } from '../../../_shared/services';
import { runInTransaction, runQuery } from '../../../_shared/services/dBService';
import {
	resendUserVerificationCode,
	verifyUserCredentials,
	verifyUserLogin,
	verifyUserVerificationCode
} from '../authControllers';
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
			(runInTransaction.mockResolvedValueOnce as any)({ id: 'x7i9-3l-n3k4-3i8bi2' });
			await verifyUserCredentials(requestMock, responseMock);
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
		});

		test('should not create a user if exists', (done) => {
			(runQuery.mockReturnValueOnce as any)({ id: '9383iwe382' });
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
			createMock.mockRestore();
			expect(sendVerificationCodeByEmail).toHaveBeenCalledWith('89ej5', 'test@test.com');
		});
	});

	describe('#verifyUserVerificationCode', () => {
		const requestMock: any = {
			body: { data: { verificationCode: '9384k' } },
			user: { id: 'x7i9-3l-n3k4-3i8bi2' }
		};
		const verifyMock = jest.spyOn(service, 'checkUserVerificationCode');
		verifyMock.mockImplementation().mockResolvedValueOnce(true);

		test('should send a status of 201 with the json data', async () => {
			await verifyUserVerificationCode(requestMock, responseMock);
			verifyMock.mockRestore();
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
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

	describe('#verifyUserLogin', () => {
		const req: any = { body: { data: { email: 'test@test.com' } } };
		test('should send a status of 201 for successful login', async () => {
			const verifyMock = jest.spyOn(service, 'verifyUserLoginCredentials');
			verifyMock.mockImplementationOnce(jest.fn()).mockRejectedValueOnce({
				id: 'x7i9-3l-n3k4-3i8bi2',
				token: '05vj93j9r39th0'
			});
			await verifyUserLogin(req, responseMock);
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
		});
	});

	describe('#resendUserVerificationCode', () => {
		const user = { id: 'fh3t9j0d2', verificationCode: 'r2gr8', email: 'test@test.com' };
		const reqMock: any = { user: { id: 'fh3t9j0d2' } };

		beforeEach(() => {
			(runQuery.mockResolvedValueOnce as any)(user);
		});

		test('should send a status of 201 when successful', async () => {
			await resendUserVerificationCode(reqMock, responseMock);
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
		});

		test('should send verification code to email', async () => {
			await resendUserVerificationCode(reqMock, responseMock);
			expect(sendVerificationCodeByEmail).toHaveBeenCalledWith(
				user.verificationCode,
				user.email
			);
		});

		test('should send json response for data true', async () => {
			await resendUserVerificationCode(reqMock, responseMock);
			expect(responseMock.json).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.any(Boolean),
					success: expect.any(Boolean)
				})
			);
		});
	});
});
