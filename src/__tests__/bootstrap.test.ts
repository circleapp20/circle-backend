import { bootstrap } from '../bootstrap';
import { Constants } from '../_shared/constants';
import * as storageService from '../_shared/services/storageService';

jest.mock('cors');
jest.mock('../_shared/services/serverService');

describe('#bootstrap', () => {
	beforeEach(() => jest.clearAllMocks());

	const app: any = { listen: jest.fn(), use: jest.fn(), all: jest.fn() };
	const mockFn = jest.spyOn(storageService, 'createDBSchema').mockImplementation();

	test('should call the listen on express', async () => {
		await bootstrap(app);
		expect(app.listen).toBeCalled();
	});

	test('should start the server on port 4000', async () => {
		await bootstrap(app);
		expect(app.listen).toBeCalledWith(Constants.app.PORT, undefined);
	});

	test('should add middleware to the server', async () => {
		await bootstrap(app);
		expect(app.use).toHaveBeenCalledTimes(5);
	});

	test('should not start server when database is not created', async () => {
		mockFn.mockRejectedValueOnce(new Error());
		const fn = () => bootstrap(app);
		expect(fn).rejects.toThrow();
		expect(app.listen).not.toHaveBeenCalled();
	});

	test('should call all for next app', async () => {
		await bootstrap(app);
		expect(app.all).toHaveBeenCalled();
	});
});
