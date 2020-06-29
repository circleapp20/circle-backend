import { SERVER } from 'base/config/server';
import { entityManager } from 'base/testUtils/node/entityManager';
import bcryptjs from 'bcryptjs';
import { encryptData } from 'core/encryption/node/encryption';
import faker from 'faker';
import {
	verifyUserCredentials,
	verifyUserCredentialsForPasswordReset,
	verifyUserLogin,
	verifyUserVerificationCode
} from 'feature/authentication/controllers/verifyUserHandlers';
import { sendVerificationCodeByMedia } from 'feature/authentication/messaging/sendVerificationCode';
import { createUserFixture } from 'fixtures/users';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/users');
jest.mock('core/models/node/fellows');
jest.mock('core/models/node/locations');
jest.mock('feature/authentication/messaging/sendVerificationCode');

beforeEach(() => jest.clearAllMocks());

const responseMock: any = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn().mockReturnThis()
};

describe('#verifyUserCredentials', () => {
	const requestMock: any = { body: { data: { email: 'test@test.com' } } };
	const vCode = faker.random.word();
	const profile = {
		...createUserFixture(),
		verificationCode: encryptData({ text: vCode })
	};

	test('should create a new user', async () => {
		entityManager.getOne.mockReturnValueOnce(null).mockReturnValueOnce(profile);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [profile] });
		await verifyUserCredentials(requestMock, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(SERVER.status.CREATED);
	});

	test('should not create a user if exists', (done) => {
		entityManager.getOne.mockReturnValueOnce(profile);
		verifyUserCredentials(requestMock, responseMock).catch(({ message }) => {
			expect(responseMock.status).not.toHaveBeenCalled();
			expect(message).toBe('User already exists');
			done();
		});
	});

	test('should send verification by email', async () => {
		entityManager.getOne.mockReturnValueOnce(null).mockReturnValueOnce(profile);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [profile] });
		await verifyUserCredentials(requestMock, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				media: expect.stringMatching('email'),
				verificationCode: vCode,
				email: expect.stringMatching(profile.email)
			})
		);
	});

	test('should send verification code by sms if phoneNumber', async () => {
		const data = { ...profile, email: '' };
		entityManager.getOne.mockReturnValueOnce(null).mockReturnValueOnce(data);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [data] });
		const req: any = { body: { data: { phoneNumber: data.phoneNumber } } };
		await verifyUserCredentials(req, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({
				media: expect.stringMatching('phoneNumber'),
				verificationCode: vCode,
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
		expect(responseMock.status).toHaveBeenCalledWith(SERVER.status.CREATED);
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
	const user = createUserFixture();
	const req: any = { body: { data: { email: user.email, password: user.password } } };

	test('should send a status of 201 for successful login', async () => {
		entityManager.getOne.mockReturnValueOnce({
			...user,
			password: bcryptjs.hashSync(user.password)
		});
		await verifyUserLogin(req, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(SERVER.status.CREATED);
	});
});

describe('#verifyUserCredentialsForPasswordReset', () => {
	const profile = { ...createUserFixture(), verificationCode: encryptData({ text: '123456' }) };
	const req: any = { body: { data: { email: profile.email } } };

	test('should send verification code to user email', async () => {
		entityManager.getOne.mockReturnValueOnce({ ...profile, phoneNumber: '' });
		await verifyUserCredentialsForPasswordReset(req, responseMock);
		expect(sendVerificationCodeByMedia).toHaveBeenCalledWith(
			expect.objectContaining({ media: 'email' })
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
		expect(responseMock.status).toHaveBeenCalledWith(SERVER.status.CREATED);
	});
});
