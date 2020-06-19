import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import next from 'next';
import * as enhancers from 'shared/node/enhancers';
import { getSignedAuthToken } from 'shared/node/validation';
import { IApiRoute } from 'shared/types';

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
		const api = enhancers.getApiRouter(router, routes);
		expect(api).toBeDefined();
	});

	test('should call request method on router corresponding with routes method', () => {
		enhancers.getApiRouter(router, routes);
		expect(router.post).toHaveBeenCalledTimes(1);
	});
});

describe('#wrapController', () => {
	const request: any = {};
	const response: any = {};
	const next = jest.fn();

	test('should call the controller with req and res values', async () => {
		const controllerMock = jest.fn();
		const wrappedController = enhancers.wrapController(controllerMock);
		await wrappedController(request, response, next);
		expect(controllerMock).toHaveBeenCalledWith({}, {});
	});

	test('should call next when error is thrown in controller', async () => {
		const controllerMock = jest.fn();
		controllerMock.mockRejectedValueOnce(new Error());
		const wrappedController = enhancers.wrapController(controllerMock);
		await wrappedController(request, response, next);
		expect(next).toHaveBeenCalledTimes(1);
	});
});

describe('#getNextRequestHandler', () => {
	test('should run next in dev mode', async () => {
		await enhancers.getNextRequestHandler();
		expect(next).toHaveBeenCalledWith({ dev: true });
	});

	test('should run in production when specified', async () => {
		await enhancers.getNextRequestHandler(false);
		expect(next).toHaveBeenCalledWith({ dev: false });
	});
});

describe('#getNextRouter', () => {
	test('should call the handler function', () => {
		const handleMock = jest.fn();
		const router = enhancers.getNextRouter(handleMock);
		router({} as any, {} as any);
		expect(handleMock).toHaveBeenCalledTimes(1);
	});
});

describe('#getRouteSchema', () => {
	const req: any = {};
	const res: any = {};
	const next = jest.fn();
	const schema = Joi.object({ id: Joi.string() });

	test('should call next when schema is undefined', () => {
		const middleware: any = enhancers.getRouteSchema();
		middleware(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test('should call the validator when schema is defined', () => {
		const middleware: any = enhancers.getRouteSchema(schema);
		middleware(req, res, next);
		expect(createValidator).toHaveBeenCalledWith({ passError: true });
		expect(next).not.toHaveBeenCalled();
	});

	test('should validate query when specified', () => {
		const middleware: any = enhancers.getRouteSchema(schema, 'query');
		middleware(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});
});

describe('#authorizedApiRoute', () => {
	const req: any = { body: {}, headers: {} };
	const res: any = {};
	const next = jest.fn();

	test('should skip middleware for undefined roles', () => {
		const middleware = enhancers.authorizedApiRoute();
		middleware(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test('should throw when user is null', () => {
		const middleware = enhancers.authorizedApiRoute([]);
		expect(() => {
			req.headers.authorization = 'Bearer l4sfn784ow5en7io4vo84nw4038gnw';
			middleware(req, res, next);
		}).toThrow();
	});

	test('should throw when user does not have access', () => {
		const middleware = enhancers.authorizedApiRoute(['super_admin']);
		expect(() => {
			const token = getSignedAuthToken({ roles: ['user'] });
			req.headers.authorization = `Bearer ${token}`;
			middleware(req, res, next);
		}).toThrow();
	});

	test('should add user to the request object', () => {
		const middleware = enhancers.authorizedApiRoute(['super_admin']);
		const token = getSignedAuthToken({ roles: ['super_admin'] });
		req.headers.authorization = `Bearer ${token}`;
		middleware(req, res, next);
		expect(req.user).toEqual({ roles: ['super_admin'] });
		expect(next).toHaveBeenCalled();
	});
});
