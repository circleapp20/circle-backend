import { SERVER } from 'base/config/server';
import { runInsertQuery, runInTransaction, runQuery } from 'core/database/queryRunners';
import { getLocationByIdQuery } from 'core/queries/locationDetailsQueries';
import {
	addLocationPlaceQuery,
	addLocationQuery
} from 'feature/locations/queries/addLocationQuery';
import { EntityManager } from 'typeorm';

interface IAddLocation {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	isVerified?: boolean;
	placeId: string;
}

export const addLocationTransaction = (args: IAddLocation) => {
	const { placeId, ...other } = args;
	return async (manager: EntityManager) => {
		const [location] = await runInsertQuery(addLocationQuery, [other], manager);
		if (placeId) await runQuery(addLocationPlaceQuery, [{ id: location.id, placeId }], manager);
		return runQuery(getLocationByIdQuery, [location.id], manager);
	};
};

export const addLocationService = async (args: IAddLocation, privileges: string[]) => {
	const isVerified = privileges.includes(SERVER.privileges.LEAD_FELLOW);
	const locationTransaction = addLocationTransaction({ ...args, isVerified });
	const location = await runInTransaction(locationTransaction);
	return location;
};
