import { NextFunction, Request, Response, Router } from 'express';
import next from 'next';
import { IApiRoute } from '../types';
import { authorizedApiRoute } from './authService';

export const wrapController = (controller: (req: Request, res: Response) => Promise<void>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res);
		} catch (error) {
			next(error);
		}
	};
};

export const getApiRouter = (router: Router, routes: IApiRoute[]) => {
	routes.forEach(({ path, controller, method, privileges }) => {
		router[method](path, authorizedApiRoute(privileges), wrapController(controller));
	});
	return router;
};

export const getNextRequestHandler = async (dev = process.env.NODE_ENV !== 'production') => {
	const server = next({ dev });
	const handler = server.getRequestHandler();
	await server.prepare();
	return handler;
};

export const getNextRouter = (handler: (...args: any[]) => Promise<void>) => {
	return (req: Request, res: Response) => handler(req, res);
};
