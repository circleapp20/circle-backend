import { ConnectionOptions, createConnection, EntityManager, InsertResult } from 'typeorm';
import { Constants } from '../constants';
import entities from './schemaService';
import { generateCodeFromNumber } from './utilities';

export const getSqlInstance = (name = 'default', synchronize = false) => {
	let options: ConnectionOptions = {
		type: 'mysql',
		url: Constants.app.DATABASE_URL,
		name,
		entities,
		synchronize
	};

	if (process.env.NODE_ENV === 'production') {
		options = Object.assign({}, options, { extra: { ssl: true }, type: 'postgres' });
	}

	return createConnection(options);
};

export const runInsertQuery = async (
	queryBuilder: (manager: EntityManager, ...params: any[]) => Promise<InsertResult>,
	params: any[],
	manager?: EntityManager
) => {
	const getQueryResults = async (entityManager: EntityManager) => {
		const results = await queryBuilder(entityManager, ...params);
		return results.generatedMaps;
	};

	// the check for the manager value is to ensure that the runInsertQuery
	// function makes use of the entity manager from the runInTransaction
	// function. this will not terminate or close the function after it's
	// operation is done
	if (manager) return getQueryResults(manager);

	// create a new connection to the database with a new connection name
	// this is done to prevent unwanted closing of database connections when
	// a process is not done executing for a different request
	const conn = await getSqlInstance(generateCodeFromNumber());
	const results = await getQueryResults(conn.manager);
	await conn.close(); // close the connection after executing the query
	return results;
};

export const runQuery = async <T>(
	queryBuilder: (manager: EntityManager, ...params: any[]) => Promise<T>,
	params: any[] | EntityManager = [],
	manager?: EntityManager
) => {
	const entityManager = !Array.isArray(params) ? (params as EntityManager) : manager;

	// since params can be an entityManager or any array of values,
	// we check for the value of params if is an array then assign
	// it to queryParams if not a default empty array to assigned to it
	const queryParams = Array.isArray(params) ? params : [];

	const getQueryResults = async (args: EntityManager) => {
		const results = await queryBuilder(args, ...queryParams);
		return results;
	};

	if (entityManager) return getQueryResults(entityManager);

	const conn = await getSqlInstance(generateCodeFromNumber());
	const results = await getQueryResults(conn.manager);
	await conn.close(); // close the connection after executing the query
	return results;
};

export const runInTransaction = async <T = any>(
	callBack: (manager: EntityManager) => Promise<T>
) => {
	const conn = await getSqlInstance(generateCodeFromNumber());
	const results = await conn.transaction(callBack);
	return results;
};
