import { Constants } from 'base/constants';
import { resetUserPassword, updateProfile } from 'feature/users/controllers/updateUsers';
import * as dataService from 'feature/users/services/node/updateUserProfileService';

jest.mock('core/node/database/queryRunners');
jest.mock('base/common/schema/users');
jest.mock('base/common/schema/fellows');

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

describe('#resetUserPassword', () => {
	test('should send a status of 201 for reset password', async () => {
		const spy = jest.spyOn(dataService, 'updateUserPassword');
		spy.mockImplementation(() => Promise.resolve(true));
		const req: any = { user: { id: '28fn' }, body: { data: { password: '922fif82' } } };
		await resetUserPassword(req, responseMock);
		expect(responseMock.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
	});
});
