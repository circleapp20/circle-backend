import { SERVER } from 'base/config/server';
import { getBadRequestError } from 'base/utils/errors/node/badRequestError';
import { runInsertQuery, runInTransaction, runQuery } from 'core/database/queryRunners';
import { getLocationByIdQuery } from 'core/queries/locationDetailsQueries';
import {
	addStoreLocationQuery,
	addStoreQuery,
	addStoreUserQuery
} from 'feature/stores/queries/addStoreQueries';
import { getStoreByIdQuery } from 'feature/stores/queries/getStoreDetailsQueries';

interface IAddStoreDetails {
	name: string;
	category: string;
	locationId: string;
	userId: string;
}

export const addStore = async (details: IAddStoreDetails, roles: string[]) => {
	const { locationId, userId, ...rest } = details;

	const location = runQuery(getLocationByIdQuery, [locationId]);

	if (!location) throw getBadRequestError('location does not exists');

	const isVerified = roles.includes(SERVER.privileges.LEAD_FELLOW);

	const storeDetails = Object.assign({}, rest, { isVerified });

	const store = await runInTransaction(async (manager) => {
		const [results] = await runInsertQuery(addStoreQuery, [storeDetails], manager);

		const storeId = results.id;

		// link store's location
		await runQuery(addStoreLocationQuery, [{ locationId, storeId }], manager);

		// link store to user
		await runQuery(addStoreUserQuery, [{ userId, storeId }], manager);

		return runQuery(getStoreByIdQuery, [storeId], manager);
	});

	// remove password and verificationCode in user object
	delete store!.user.password;
	delete store!.user.verificationCode;

	return store;
};
