import { runQuery } from 'core/database/queryRunners';
import { getStoresQuery } from 'feature/stores/queries/getStoreDetailsQueries';

export const getStores = async () => {
	const stores = await runQuery(getStoresQuery);
	const formattedStores = stores.map((store) => {
		// remove password and verificationCode in user object
		delete store!.user.password;
		delete store!.user.verificationCode;

		return store;
	});
	return formattedStores;
};
