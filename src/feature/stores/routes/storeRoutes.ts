import { SERVER } from 'base/config/server';
import { IApiRoute } from 'base/types';
import { AddStoreSchema } from 'feature/stores/apiSchema/addStoreSchema';
import { addStoreHandler } from 'feature/stores/controller/addStoreHandler';
import { getStoresHandler } from 'feature/stores/controller/storesHandler';

export const storeRoutes: IApiRoute[] = [
	{
		path: '/stores',
		method: 'post',
		controller: addStoreHandler,
		schema: AddStoreSchema,
		privileges: [SERVER.privileges.USER]
	},
	{
		path: '/stores',
		method: 'get',
		controller: getStoresHandler,
		privileges: [
			SERVER.privileges.USER,
			SERVER.privileges.FELLOW,
			SERVER.privileges.LEAD_FELLOW
		]
	}
];
