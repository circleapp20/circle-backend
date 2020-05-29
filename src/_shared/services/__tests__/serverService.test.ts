import { object, string } from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import next from 'next';
import { IApiRoute } from '../../types';
import {
	getApiRouter,
	getNextRequestHandler,
	getNextRouter,
	getRouteSchema,
	wrapController
} from '../serverService';

jest.mock('next', () => {
	return jest.fn().mockReturnValue({
		getRequestHandler: jest.fn(),
		prepare: jest.fn().mockResolvedValue(true)
	});
});
jest.mock('express-joi-validation', () => ({
	createValidator: jest.fn().mockReturnValue({
		body: jest.fn().mockReturnValue(jest.fn()),
		query: jest.fn().mockReturnValue(jest.fn())
	})
}));

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
				controller: (): any => {
					return;
				}
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

	describe('#getNextRequestHandler', () => {
		test('should run next in dev mode', async () => {
			await getNextRequestHandler();
			expect(next).toHaveBeenCalledWith({ dev: true });
		});

		test('should run in production when specified', async () => {
			await getNextRequestHandler(false);
			expect(next).toHaveBeenCalledWith({ dev: false });
		});
	});

	describe('#getNextRouter', () => {
		test('should call the handler function', () => {
			const handleMock = jest.fn();
			const router = getNextRouter(handleMock);
			router({} as any, {} as any);
			expect(handleMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('#getRouteSchema', () => {
		const req: any = {};
		const res: any = {};
		const next = jest.fn();
		const schema = object({ id: string() });

		test('should call next when schema is undefined', () => {
			const middleware = getRouteSchema();
			middleware(req, res, next);
			expect(next).toHaveBeenCalled();
		});

		test('should call the validator when schema is defined', () => {
			const middleware = getRouteSchema(schema);
			middleware(req, res, next);
			expect(createValidator).toHaveBeenCalledWith({ passError: true });
			expect(next).not.toHaveBeenCalled();
		});

		test('should validate query when specified', () => {
			const middleware = getRouteSchema(schema, 'query');
			middleware(req, res, next);
			expect(next).not.toHaveBeenCalled();
		});
	});
});
