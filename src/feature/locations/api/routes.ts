import { SERVER } from 'base/config/server';
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
			SERVER.privileges.FELLOW,
			SERVER.privileges.LEAD_FELLOW,
			SERVER.privileges.USER
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
