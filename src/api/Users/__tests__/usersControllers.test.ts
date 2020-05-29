import { Constants } from '../../../_shared/constants';
import * as dataService from '../dataService';
import { checkUsername, updateProfile } from '../usersControllers';

beforeEach(() => jest.clearAllMocks());

describe('#usersControllers', () => {
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

	describe('#checkUsername', () => {
		test('should send status of 201 if username exists or not', async () => {
			const checkMock = jest.spyOn(dataService, 'checkUsernameExists');
			checkMock.mockImplementation(async () => false);

			const req: any = { query: { username: 'username' } };

			await checkUsername(req, responseMock);
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
		});
	});
});
