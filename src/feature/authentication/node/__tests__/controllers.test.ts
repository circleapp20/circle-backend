import * as service from 'feature/authentication/node/authService';
import {
	resendUserVerificationCode,
	verifyUserCredentials,
	verifyUserCredentialsForPasswordReset,
	verifyUserLogin,
	verifyUserVerificationCode
} from 'feature/authentication/node/controllers';
import { sendVerificationCodeByMedia } from 'feature/authentication/node/messaging';
import { createUserFixture } from 'fixtures/users';
import { Constants } from 'shared/constants';
import { runInTransaction, runQuery } from 'shared/node/database';
import { encryptData } from 'shared/node/encryption';
import { entityManager } from 'shared/testUtils/node/entityManager';

jest.mock('shared/node/database');
jest.mock('shared/common/schema/users');
jest.mock('shared/common/schema/fellows');
jest.mock('shared/common/schema/locations');
jest.mock('feature/authentication/node/messaging');

beforeEach(() => jest.clearAllMocks());

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
	const profile = createUserFixture();

	const requestMock: any = {
		body: { data: { verificationCode: '123456' } },
		user: { id: profile.id }
	};
	const user = { ...profile, verificationCode: encryptData({ text: '123456' }) };

	test('should send a status of 201 with the json data', async () => {
		entityManager.getOne.mockReturnValueOnce(user);
		await verifyUserVerificationCode(requestMock, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
		expect(responseMock.json).toHaveBeenCalledWith({
			data: true,
			success: true
		});
	});

	test('should throw when user is invalid', () => {
		entityManager.getOne.mockReturnValueOnce(null);
		expect(
			verifyUserVerificationCode(requestMock, responseMock)
		).rejects.toThrowErrorMatchingSnapshot();
	});

	test('should throw when verification code is invalid', () => {
		entityManager.getOne.mockReturnValueOnce(user);
		requestMock.body.data.verificationCode = '098765';
		expect(
			verifyUserVerificationCode(requestMock, responseMock)
		).rejects.toThrowErrorMatchingSnapshot();
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
	const user = { ...createUserFixture(), verificationCode: encryptData({ text: '123456' }) };
	let reqMock: any = { user: { id: 'fh3t9j0d2' }, query: {} };

	test('should send a status of 201 when successful', async () => {
		entityManager.getOne.mockReturnValueOnce(user);
		await resendUserVerificationCode(reqMock, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
	});

	test('should send verification code to email', async () => {
		entityManager.getOne.mockReturnValueOnce(user);
		await resendUserVerificationCode(reqMock, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				media: expect.stringMatching('email'),
				verificationCode: expect.stringMatching('123456'),
				email: expect.stringMatching(user.email)
			})
		);
	});

	test('should send json response for data true', async () => {
		entityManager.getOne.mockReturnValueOnce(user);
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
		entityManager.getOne.mockReturnValueOnce(data);
		await resendUserVerificationCode(reqMock, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				media: expect.stringMatching('phoneNumber'),
				verificationCode: expect.stringMatching('123456'),
				email: expect.stringMatching(''),
				phoneNumber: data.phoneNumber
			})
		);
	});

	test('should send verification code to specified media', async () => {
		entityManager.getOne.mockReturnValueOnce(user);
		reqMock = { user: { id: user.id }, query: { media: 'email' } };
		await resendUserVerificationCode(reqMock, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				media: expect.stringMatching('email'),
				verificationCode: expect.stringMatching('123456'),
				email: expect.stringMatching(user.email)
			})
		);
	});
});

describe('#verifyUserCredentialsForPasswordReset', () => {
	const profile = { ...createUserFixture(), verificationCode: encryptData({ text: '123456' }) };
	const req: any = { body: { data: { email: profile.email } } };

	test('should send verification code to user email', async () => {
		entityManager.getOne.mockReturnValueOnce({ ...profile, phoneNumber: '' });
		await verifyUserCredentialsForPasswordReset(req, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				media: 'email'
			})
		);
	});

	test('should send verification code to user phone number', async () => {
		entityManager.getOne.mockReturnValueOnce({ ...profile, email: '' });
		await verifyUserCredentialsForPasswordReset(req, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				media: expect.stringMatching('phoneNumber')
			})
		);
	});

	test('should not send verification code if user has both phone number and email', async () => {
		entityManager.getOne.mockReturnValueOnce(profile);
		await verifyUserCredentialsForPasswordReset(req, responseMock);
		expect(responseMock.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					message: expect.stringContaining(
						'Verification code cannot be sent. User has both email and phone number'
					)
				}),
				success: expect.any(Boolean)
			})
		);
	});

	test('should send status of 201', async () => {
		entityManager.getOne.mockReturnValueOnce(profile);
		await verifyUserCredentialsForPasswordReset(req, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(Constants.status.CREATED);
	});
});
