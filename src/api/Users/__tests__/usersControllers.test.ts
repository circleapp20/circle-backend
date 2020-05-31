import { Constants } from '../../../_shared/constants';
import * as dataService from '../dataService';
import { searchUsernameOrEmail, updateProfile } from '../usersControllers';

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
});
