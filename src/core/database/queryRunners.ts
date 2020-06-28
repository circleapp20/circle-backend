import { generateCodeFromNumber } from 'base/utils/node/codeGenerator';
import { getSqlInstance } from 'core/database/dBInstance';
import * as typeorm from 'typeorm';

interface RunInsertQueryType extends Partial<jest.Mock> {
	(
		queryBuilder: (
			manager: typeorm.EntityManager,
			...params: any[]
		) => Promise<typeorm.InsertResult | undefined>,
		params: any[],
		manager?: typeorm.EntityManager
	): Promise<typeorm.ObjectLiteral[]>;
}

export const runInsertQuery: RunInsertQueryType = async (
	queryBuilder: (
		manager: typeorm.EntityManager,
		...params: any[]
	) => Promise<typeorm.InsertResult | undefined>,
	params: any[],
	manager?: typeorm.EntityManager
) => {
	const getQueryResults = async (entityManager: typeorm.EntityManager) => {
		const results = await queryBuilder(entityManager, ...params);
		return results ? results.generatedMaps : [];
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

interface RunQueryType extends Partial<jest.Mock> {
	<T>(
		queryBuilder: (manager: typeorm.EntityManager, ...params: any[]) => Promise<T>,
		params?: any[] | typeorm.EntityManager,
		manager?: typeorm.EntityManager
	): Promise<T>;
}

export const runQuery: RunQueryType = async <T>(
	queryBuilder: (manager: typeorm.EntityManager, ...params: any[]) => Promise<T>,
	params: any[] | typeorm.EntityManager = [],
	manager?: typeorm.EntityManager
) => {
	const entityManager = !Array.isArray(params) ? (params as typeorm.EntityManager) : manager;

	// since params can be an entityManager or any array of values,
	// we check for the value of params if is an array then assign
	// it to queryParams if not a default empty array to assigned to it
	const queryParams = Array.isArray(params) ? params : [];

	const getQueryResults = async (args: typeorm.EntityManager) => {
		const results = await queryBuilder(args, ...queryParams);
		return results;
	};

	if (entityManager) return getQueryResults(entityManager);

	const conn = await getSqlInstance(generateCodeFromNumber());
	const results = await getQueryResults(conn.manager);
	await conn.close(); // close the connection after executing the query
	return results;
};

interface RunInTransactionType extends Partial<jest.Mock> {
	<T = any>(callBack: (manager: typeorm.EntityManager) => Promise<T>): Promise<T>;
}

export const runInTransaction: RunInTransactionType = async <T>(
	callBack: (manager: typeorm.EntityManager) => Promise<T>
) => {
	const conn = await getSqlInstance(generateCodeFromNumber());
	const results = await conn.transaction(callBack);
	return results;
};
