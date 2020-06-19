import { Constants } from 'shared/constants';
import * as database from 'shared/node/database';
import { bootstrap } from '../bootstrap';

jest.mock('cors');
jest.mock('shared/node/enhancers');
jest.mock('shared/common/schema/entities');
jest.mock('shared/common/schema/users');
jest.mock('shared/common/schema/fellows');
jest.mock('shared/common/schema/baseModel');
jest.mock('shared/common/schema/locations');

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
