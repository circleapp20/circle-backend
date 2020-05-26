import cors from 'cors';
import { Express, Router } from 'express';
import { apiRoutes } from './api/routes';
import { Constants } from './_shared/constants';
import { errorMiddleware, getApiRouter } from './_shared/services';

export const bootstrap = (app: Express, callBack?: () => void) => {
	app.use(cors());

	// add the api routes for version 1
	app.use('/api/v1', getApiRouter(Router(), apiRoutes));

	// add an error middleware to handle errors thrown during request
	// processing, which will gracefully return the proper error response
	// back to the client
	app.use(errorMiddleware);

	app.listen(Constants.app.PORT, callBack);
};
