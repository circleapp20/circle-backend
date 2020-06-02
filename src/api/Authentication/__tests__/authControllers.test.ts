import { Constants } from '../../../_shared/constants';
import { getBadRequestError } from '../../../_shared/services';
import { runInTransaction, runQuery } from '../../../_shared/services/dBService';
import {
	resendUserVerificationCode,
	verifyUserCredentials,
	verifyUserCredentialsForPasswordReset,
	verifyUserLogin,
	verifyUserVerificationCode
} from '../authControllers';
import { sendVerificationCodeByMedia, sendVerificationCodeBySMS } from '../authService';
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
		const profile = {
			id: 'x7i9-3l-n3k4-3i8bi2',
			verificationCode: '89ej5',
			email: 'test@test.com',
			phoneNumber: '+233248252444'
		};

		test('should create a new user', async () => {
			(runInTransaction.mockResolvedValueOnce as any)(profile);
			await verifyUserCredentials(requestMock, responseMock);
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
		});

		test('should not create a user if exists', (done) => {
			(runQuery.mockReturnValueOnce as any)(profile);
			verifyUserCredentials(requestMock, responseMock).catch(({ message }) => {
				expect(responseMock.status).not.toHaveBeenCalled();
				expect(message).toBe('User already exists');
				done();
			});
		});

		test('should send verification by email', async () => {
			(runInTransaction.mockResolvedValueOnce as any)(profile);
			await verifyUserCredentials(requestMock, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					media: expect.stringMatching('email'),
					verificationCode: expect.stringMatching(profile.verificationCode),
					email: expect.stringMatching(profile.email)
				})
			);
		});

		test('should send verification code by sms if phoneNumber', async () => {
			const data = { ...profile, email: '' };
			(runInTransaction.mockResolvedValueOnce as any)(data);
			const req: any = { body: { data: { phoneNumber: '+233248252444' } } };
			await verifyUserCredentials(req, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					media: expect.stringMatching('phoneNumber'),
					verificationCode: expect.stringMatching(data.verificationCode),
					phoneNumber: expect.any(String)
				})
			);
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
		const user = {
			id: 'fh3t9j0d2',
			verificationCode: 'r2gr8',
			email: 'test@test.com',
			phoneNumber: ''
		};
		let reqMock: any = { user: { id: 'fh3t9j0d2' }, query: {} };

		beforeEach(() => {
			(runQuery.mockResolvedValue as any)(user);
		});

		test('should send a status of 201 when successful', async () => {
			await resendUserVerificationCode(reqMock, responseMock);
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
		});

		test('should send verification code to email', async () => {
			await resendUserVerificationCode(reqMock, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					media: expect.stringMatching('email'),
					verificationCode: expect.stringMatching(user.verificationCode),
					email: expect.stringMatching(user.email)
				})
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

		test('should send verification code to phoneNumber', async () => {
			const data = { ...user, phoneNumber: '+2341234567', email: '' };
			(runQuery.mockResolvedValueOnce as any)(data);
			await resendUserVerificationCode(reqMock, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					media: expect.stringMatching('phoneNumber'),
					verificationCode: expect.stringMatching(user.verificationCode),
					email: expect.stringMatching(''),
					phoneNumber: expect.any(String)
				})
			);
		});

		test('should send verification code to specified media', async () => {
			reqMock = { user: { id: 'fh3t9j0d2' }, query: { media: 'email' } };
			await resendUserVerificationCode(reqMock, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					media: expect.stringMatching('email'),
					verificationCode: expect.stringMatching(user.verificationCode),
					email: expect.stringMatching(user.email)
				})
			);
		});
	});

	describe('#verifyUserCredentialsForPasswordReset', () => {
		const req: any = { body: { data: { email: 'test@test.com' } } };

		test('should send verification code to user email', async () => {
			(runQuery.mockResolvedValueOnce as any)({
				id: '3939202',
				verificationCode: 'jf983w',
				email: 'test@test.com'
			});
			await verifyUserCredentialsForPasswordReset(req, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					media: expect.stringMatching('email'),
					email: expect.any(String)
				})
			);
			expect(sendVerificationCodeBySMS).not.toHaveBeenCalled();
			expect(responseMock.json).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						user: expect.objectContaining({
							id: expect.any(String),
							verificationCode: expect.any(String),
							email: expect.any(String),
							token: expect.any(String)
						}),
						message: expect.stringContaining("Verification code sent to user's email")
					}),
					success: expect.any(Boolean)
				})
			);
		});

		test('should send verification code to user phone number', async () => {
			(runQuery.mockResolvedValueOnce as any)({
				id: '3939202',
				verificationCode: 'jf983w',
				phoneNumber: '+2339876543'
			});
			await verifyUserCredentialsForPasswordReset(req, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					media: expect.stringMatching('phoneNumber'),
					phoneNumber: expect.any(String)
				})
			);
			expect(responseMock.json).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						user: expect.objectContaining({
							id: expect.any(String),
							verificationCode: expect.any(String),
							phoneNumber: expect.any(String),
							token: expect.any(String)
						}),
						message: expect.stringContaining(
							"Verification code sent to user's phone number"
						)
					}),
					success: expect.any(Boolean)
				})
			);
		});

		test('should not send verification code if user has both phone number and email', async () => {
			(runQuery.mockResolvedValueOnce as any)({
				id: '3939202',
				verificationCode: 'jf983w',
				phoneNumber: '+2339876543',
				email: 'test@test.com'
			});
			await verifyUserCredentialsForPasswordReset(req, responseMock);
			expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
				expect.objectContaining({
					phoneNumber: expect.stringMatching(''),
					email: expect.stringMatching('')
				})
			);
			expect(responseMock.json).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						user: expect.objectContaining({
							id: expect.any(String),
							verificationCode: expect.any(String),
							phoneNumber: expect.any(String),
							token: expect.any(String),
							email: expect.any(String)
						}),
						message: expect.stringContaining(
							'Verification code cannot be sent. User has both email and phone number'
						)
					}),
					success: expect.any(Boolean)
				})
			);
		});

		test('should send status of 201', async () => {
			(runQuery.mockResolvedValueOnce as any)({
				id: '3939202',
				verificationCode: 'jf983w',
				phoneNumber: '+2339876543',
				email: 'test@test.com'
			});
			await verifyUserCredentialsForPasswordReset(req, responseMock);
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
		});
	});
});
