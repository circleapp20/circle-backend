import { Constants } from 'base/config/node/constants';
import { IApiRoute } from 'base/types';
import { AddLocationSchema } from 'feature/locations/api/schema/addLocationSchema';
import { addLocationHandler } from 'feature/locations/controllers/addLocationHandler';
import {
	getLocationDetailsHandler,
	getLocationsHandler
} from 'feature/locations/controllers/getLocationsHandler';

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
	},
	{
		path: '/locations/:id',
		method: 'get',
		controller: getLocationDetailsHandler
	}
];
