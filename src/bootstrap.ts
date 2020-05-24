import cors from 'cors';
import { Express } from 'express';
import { Constants } from './_shared/constants';
import { errorMiddleware } from './_shared/services';

export const bootstrap = (app: Express, callBack?: () => void) => {
	app.use(cors());
	app.use(errorMiddleware);
	app.listen(Constants.app.PORT, callBack);
};
