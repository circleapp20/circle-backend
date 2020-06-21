import { Constants } from 'base/constants';
import { IApiRoute } from 'base/types';
import { addLocationHandler } from '../controllers/addLocationHandler';
import { getLocationsHandler } from '../controllers/getLocationsHandler';
import { AddLocationSchema } from './schema/addLocationSchema';

export const locationApiRoutes: IApiRoute[] = [
	{
		path: '/locations',
		method: 'post',
		controller: addLocationHandler,
		schema: AddLocationSchema,
		privileges: [
			Constants.privileges.FELLOW,
			Constants.privileges.LEAD_FELLOW,
			Constants.privileges.USER
		]
	},
	{
		path: '/locations',
		method: 'get',
		controller: getLocationsHandler
	}
];
