import { Constants } from 'base/constants';
import faker from 'faker';
import { resetUserPassword, updateProfile } from 'feature/users/controllers/updateUsers';
import * as dataService from 'feature/users/services/node/updateUserProfileService';
import { createUserFixture } from 'fixtures/users';

jest.mock('core/node/database/queryRunners');
jest.mock('base/common/schema/users');
jest.mock('base/common/schema/fellows');

beforeEach(() => jest.clearAllMocks());

describe('#updateProfile', () => {
	let res: any;

	beforeAll(() => {
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};
	});

	test('should send status of 200 when update is successful', async () => {
		const user = createUserFixture();
		const values = { ...user, locationsId: Array.from(Array(2), faker.random.uuid) };

		const req: any = {
			body: { data: values },
			user: { id: user.id, roles: [user.roles] }
		};

		const updateMock = jest.spyOn(dataService, 'updateUserProfile');
		updateMock.mockImplementationOnce(jest.fn()).mockResolvedValueOnce(values);

		await updateProfile(req, res);
		expect(res.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
	});
});

describe('#resetUserPassword', () => {
	let res: any;

	beforeAll(() => {
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};
	});

	test('should send a status of 201 for reset password', async () => {
		const spy = jest.spyOn(dataService, 'updateUserPassword');
		spy.mockImplementation(() => Promise.resolve(true));
		const req: any = { user: { id: '28fn' }, body: { data: { password: '922fif82' } } };
		await resetUserPassword(req, res);
		expect(res.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
	});
});
