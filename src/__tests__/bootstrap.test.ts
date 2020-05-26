import { bootstrap } from '../bootstrap';
import { Constants } from '../_shared/constants';
import * as storageService from '../_shared/services/storageService';

jest.mock('cors');

describe('#bootstrap', () => {
	beforeEach(() => jest.clearAllMocks());

	const app: any = { listen: jest.fn(), use: jest.fn() };
	const mockFn = jest.spyOn(storageService, 'createDBSchema');

	test('should call the listen on express', async () => {
		await bootstrap(app);
		expect(app.listen).toBeCalled();
		expect(mockFn).toHaveBeenCalled();
	});

	test('should start the server on port 4000', async () => {
		await bootstrap(app);
		expect(app.listen).toBeCalledWith(Constants.app.PORT, undefined);
		expect(mockFn).toHaveBeenCalled();
	});

	test('should add middleware to the server', async () => {
		await bootstrap(app);
		expect(app.use).toHaveBeenCalledTimes(3);
		expect(mockFn).toHaveBeenCalled();
	});

	test('should not start server when database is not created', async () => {
		mockFn.mockRejectedValueOnce(new Error());
		const fn = () => bootstrap(app);
		expect(fn).rejects.toThrow();
		expect(app.listen).not.toHaveBeenCalled();
	});
});
