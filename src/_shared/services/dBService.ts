import { createConnection, EntityManager, InsertResult } from 'typeorm';
import { Constants } from '../constants';
import entities from './schemaService';
import { generateCodeFromNumber } from './utilities';

export const getSqlInstance = (name = 'default') => {
	return createConnection({
		type: 'mysql',
		url: Constants.app.DATABASE_URL,
		name,
		entities
	});
};

export const runInsertQuery = async (
	queryBuilder: (manager: EntityManager, ...params: any[]) => Promise<InsertResult>,
	params: any[],
	manager?: EntityManager
) => {
	const queryResults = async (entityManager: EntityManager) => {
		const results = await queryBuilder(entityManager, ...params);
		return results.generatedMaps;
	};

	// the check for the manager value is to ensure that the runInsertQuery
	// function makes use of the entity manager from the runInTransaction
	// function. this will not terminate or close the function after it's
	// operation is done
	if (manager) return queryResults(manager);

	// create a new connection to the database with a new connection name
	// this is done to prevent unwanted closing of database connections when
	// a process is not done executing for a different request
	const conn = await getSqlInstance(generateCodeFromNumber());
	const results = await queryResults(conn.manager);
	await conn.close(); // close the connection after executing the query
	return results;
};
