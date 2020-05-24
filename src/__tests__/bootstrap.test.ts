import { bootstrap } from '../bootstrap';

jest.mock('cors');

describe('#bootstrap', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const app: any = { listen: jest.fn(), use: jest.fn() };

	test('should call the listen on express', () => {
		bootstrap(app);
		expect(app.listen).toBeCalled();
	});

	test('should start the server on port 4000', () => {
		bootstrap(app);
		expect(app.listen).toBeCalledWith(4000, undefined);
	});

	test('should add middleware to the server', () => {
		bootstrap(app);
		expect(app.use).toBeCalled();
	});
});
