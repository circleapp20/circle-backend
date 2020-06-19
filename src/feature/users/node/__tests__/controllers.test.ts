import {
	resetUserPassword,
	searchUsernameOrEmail,
	updateProfile
} from 'feature/users/node/controllers';
import * as dataService from 'feature/users/node/dataService';
import { Constants } from 'shared/constants';

jest.mock('shared/node/database');
jest.mock('shared/common/schema/users');
jest.mock('shared/common/schema/fellows');
jest.mock('shared/common/schema/locations');

beforeEach(() => jest.clearAllMocks());

const responseMock: any = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn().mockReturnThis()
};

describe('#updateProfile', () => {
	test('should send status of 200 when update is successful', async () => {
		const values = {
			id: 'x7i9-3l-n3k4-3i8bi2',
			verificationCode: '9384k',
			biography: '',
			dob: new Date(),
			image: '',
			password: 'password',
			username: ''
		};

		const requestMock: any = {
			body: { data: values },
			user: { id: 'x7i9-3l-n3k4-3i8bi2' }
		};

		const updateMock = jest.spyOn(dataService, 'updateUserProfile');
		updateMock.mockImplementationOnce(jest.fn()).mockResolvedValueOnce(values);

		await updateProfile(requestMock, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
	});
});

describe('#searchUsernameOrEmail', () => {
	let checkMock: jest.SpyInstance;

	beforeAll(() => {
		checkMock = jest.spyOn(dataService, 'checkUsernameOrEmailExists');
		checkMock.mockImplementation(async () => ({ username: true, email: false }));
	});

	test('should send status of 200 if username exists or not', async () => {
		const req: any = { query: { username: 'username' } };
		await searchUsernameOrEmail(req, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
	});

	test('should send a json object giving state for each search results', async () => {
		const req: any = { query: { username: 'username' } };
		await searchUsernameOrEmail(req, responseMock);
		expect(responseMock.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					username: expect.any(Boolean),
					email: expect.any(Boolean)
				}),
				success: expect.any(Boolean)
			})
		);
	});
});

describe('#resetUserPassword', () => {
	test('should send a status of 201 for reset password', async () => {
		const spy = jest.spyOn(dataService, 'updateUserPassword');
		spy.mockImplementation(() => Promise.resolve(true));
		const req: any = { user: { id: '28fn' }, body: { data: { password: '922fif82' } } };
		await resetUserPassword(req, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
	});
});
