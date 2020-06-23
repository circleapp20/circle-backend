import { Constants } from 'base/config/node/constants';
import { entityManager } from 'base/testUtils/node/entityManager';
import { encryptData } from 'core/encryption/node/encryption';
import { resendUserVerificationCode } from 'feature/authentication/controllers/resendUserVerificationCodeHandler';
import { sendVerificationCodeByMedia } from 'feature/authentication/messaging/sendVerificationCode';
import { createUserFixture } from 'fixtures/users';

jest.mock('feature/authentication/messaging/sendVerificationCode');
jest.mock('core/database/queryRunners');
jest.mock('core/models/node/locations');
jest.mock('core/models/node/users');
jest.mock('core/models/node/fellows');

beforeEach(() => jest.clearAllMocks());

const responseMock: any = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn().mockReturnThis()
};

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
