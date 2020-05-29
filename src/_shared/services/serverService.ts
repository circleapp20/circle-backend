import { Schema } from '@hapi/joi';
import { NextFunction, Request, Response, Router } from 'express';
import { createValidator } from 'express-joi-validation';
import next from 'next';
import { IApiRoute, IRequest } from '../types';
import { authorizedApiRoute } from './authService';

export const wrapController = (controller: (req: IRequest, res: Response) => Promise<void>) => {
	return async (req: IRequest, res: Response, next: NextFunction) => {
		try {
			await controller(req, res);
		} catch (error) {
			next(error);
		}
	};
};

export const getRouteSchema = (schema?: Schema, validate: 'body' | 'query' = 'body') => {
	if (!schema) {
		return (_: Request, __: Response, next: NextFunction) => next();
	}
	const validator = createValidator({ passError: true });
	return validator[validate](schema);
};

export const getApiRouter = (router: Router, routes: IApiRoute[]) => {
	routes.forEach(({ path, controller, method, privileges, schema, type }) => {
		router[method](
			path,
			authorizedApiRoute(privileges) as any,
			getRouteSchema(schema, type),
			wrapController(controller) as any
		);
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
