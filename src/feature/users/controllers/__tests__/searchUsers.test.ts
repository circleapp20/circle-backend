import { Constants } from 'base/config/node/constants';
import { searchUsernameOrEmail } from 'feature/users/controllers/searchUsers';
import * as dataService from 'feature/users/services/node/checkUserExistsService';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/users');

beforeEach(() => jest.clearAllMocks());

const responseMock: any = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn().mockReturnThis()
};

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
