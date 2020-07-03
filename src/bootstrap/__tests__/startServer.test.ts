import { SERVER } from 'base/config/server';
import { startServer } from 'bootstrap/startServer';
import * as database from 'core/database/createCircleDatabase';

jest.mock('cors');
jest.mock('base/utils/server/utilities');
jest.mock('core/database/queryRunners');
jest.mock('core/database/dBInstance');
jest.mock('core/models/node/fellows');
jest.mock('core/models/node/users');
jest.mock('core/models/node/locations');

beforeEach(() => jest.clearAllMocks());

describe('#startServer', () => {
	const app: any = { listen: jest.fn(), use: jest.fn(), all: jest.fn() };
	const mockFn = jest.spyOn(database, 'setupCircleDatabase').mockImplementation();

	test('should call the listen on express', async () => {
		await startServer(app);
		expect(app.listen).toBeCalled();
	});

	test('should start the server on port 4000', async () => {
		await startServer(app);
		expect(app.listen).toBeCalledWith(SERVER.app.PORT, undefined);
	});

	test('should add middleware to the server', async () => {
		await startServer(app);
		expect(app.use).toHaveBeenCalledTimes(5);
	});

	test('should not start server when database is not created', async () => {
		mockFn.mockRejectedValueOnce(new Error());
		const fn = () => startServer(app);
		expect(fn).rejects.toThrow();
		expect(app.listen).not.toHaveBeenCalled();
	});
});
