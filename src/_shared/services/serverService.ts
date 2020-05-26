import { NextFunction, Request, Response, Router } from 'express';
import { IApiRoute } from '../types';

export const getApiRouter = (router: Router, routes: IApiRoute[]) => {
	routes.forEach(({ path, controller, method }) => {
		const wrapController = async (req: Request, res: Response, next: NextFunction) => {
			try {
				await controller(req, res);
			} catch (error) {
				next(error);
			}
		};
		router[method](path, wrapController);
	});
	return router;
};
