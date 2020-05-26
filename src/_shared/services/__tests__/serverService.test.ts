import { IApiRoute } from '../../types';
import { getApiRouter, wrapController } from '../serverService';

beforeEach(() => jest.clearAllMocks());

describe('#serverService', () => {
	describe('#getApiRouter', () => {
		const router: any = {
			post: jest.fn()
		};

		const routes: IApiRoute[] = [
			{
				path: '/users/auth',
				method: 'post',
				controller: (): any => {}
			}
		];

		test('should create an api router', () => {
			const api = getApiRouter(router, routes);
			expect(api).toBeDefined();
		});

		test('should call request method on router corresponding with routes method', () => {
			getApiRouter(router, routes);
			expect(router.post).toHaveBeenCalledTimes(1);
		});
	});

	describe('#wrapController', () => {
		const request: any = {};
		const response: any = {};
		const next = jest.fn();

		test('should call the controller with req and res values', async () => {
			const controllerMock = jest.fn();
			const wrappedController = wrapController(controllerMock);
			await wrappedController(request, response, next);
			expect(controllerMock).toHaveBeenCalledWith({}, {});
		});

		test('should call next when error is thrown in controller', async () => {
			const controllerMock = jest.fn();
			controllerMock.mockRejectedValueOnce(new Error());
			const wrappedController = wrapController(controllerMock);
			await wrappedController(request, response, next);
			expect(next).toHaveBeenCalledTimes(1);
		});
	});
});
