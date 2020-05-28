import { Constants } from '../../../_shared/constants';
import { runInTransaction } from '../../../_shared/services/dBService';
import { updateProfile } from '../usersControllers';

jest.mock('typeorm');
jest.mock('../../../_shared/services/dBService');
jest.mock('../../../_shared/services/schemaService');

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

			// @ts-ignore
			runInTransaction.mockResolvedValueOnce(values);
			const requestMock: any = { body: { data: values } };
			await updateProfile(requestMock, responseMock);

			const { password, ...other } = values;
			expect(responseMock.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
			expect(responseMock.json).toHaveBeenCalledWith({
				data: other,
				success: true
			});
		});
	});
});
