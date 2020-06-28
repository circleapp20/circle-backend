import { Constants } from 'base/config/node/constants';
import { errorHandlerMiddleware } from 'base/errors/node/errorHandlerMiddleware';
import { getApiRouter } from 'base/server/utilities';
import { setupCircleDatabase } from 'core/database/createCircleDatabase';
import cors from 'cors';
import { Express, json, Router, urlencoded } from 'express';
import { apiRoutes } from './apiRoutes';

export const startServer = async (app: Express, callBack?: () => void) => {
	await setupCircleDatabase();

	app.use(cors());
	app.use(json());
	app.use(urlencoded({ extended: false }));

	// add the api routes for version 1
	app.use('/api/v1', getApiRouter(Router(), apiRoutes));

	// add an error middleware to handle errors thrown during request
	// processing, which will gracefully return the proper error response
	// back to the client
	app.use(errorHandlerMiddleware);

	app.listen(Constants.app.PORT, callBack);
};
