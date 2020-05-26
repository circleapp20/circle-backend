import { NextFunction, Request, Response, Router } from 'express';
import { IApiRoute } from '../types';

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
	routes.forEach(({ path, controller, method }) => {
		router[method](path, wrapController(controller));
	});
	return router;
};
