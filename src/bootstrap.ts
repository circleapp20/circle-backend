import { Constants } from 'base/constants';
import { getApiRouter, getNextRequestHandler, getNextRouter } from 'base/node/enhancers';
import { errorMiddleware } from 'base/node/errors';
import { setupCircleDatabase } from 'core/node/database/createCircleDatabase';
import cors from 'cors';
import { Express, json, Router, urlencoded } from 'express';
import { apiRoutes } from './apiRoutes';

export const bootstrap = async (app: Express, callBack?: () => void) => {
	await setupCircleDatabase();

	const handle = await getNextRequestHandler();

	app.use(cors());
	app.use(json());
	app.use(urlencoded({ extended: false }));

	// add the api routes for version 1
	app.use('/api/v1', getApiRouter(Router(), apiRoutes));

	// add next app routes
	app.all('*', getNextRouter(handle));

	// add an error middleware to handle errors thrown during request
	// processing, which will gracefully return the proper error response
	// back to the client
	app.use(errorMiddleware);

	app.listen(Constants.app.PORT, callBack);
};
