import { Constants } from 'base/constants';
import * as database from 'core/node/database/createCircleDatabase';
import { bootstrap } from '../bootstrap';

jest.mock('cors');
jest.mock('base/node/enhancers');
jest.mock('core/node/database/queryRunners');
jest.mock('core/node/database/dBInstance');
jest.mock('base/common/schema/fellows');
jest.mock('base/common/schema/users');
jest.mock('base/common/schema/locations');

describe('#bootstrap', () => {
	beforeEach(() => jest.clearAllMocks());

	const app: any = { listen: jest.fn(), use: jest.fn(), all: jest.fn() };
	const mockFn = jest.spyOn(database, 'setupCircleDatabase').mockImplementation();

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
