import bcryptJs from 'bcryptjs';
import { generateCodeFromNumber } from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import { addUserProfileQuery, countExistingSuperAdminQuery } from 'shared/node/queries';
import { entities, Users } from 'shared/node/schema';
import { IAddUserProfile } from 'shared/types';
import * as typeorm from 'typeorm';

export const getSqlInstance = (name = 'default') => {
	let options: typeorm.ConnectionOptions = {
		type: 'mysql',
		url: Constants.app.DATABASE_URL,
		name,
		entities
	};

	if (process.env.NODE_ENV === 'production') {
		options = Object.assign({}, options, {
			ssl: true,
			type: 'postgres',
			extra: { ssl: { rejectUnauthorized: false } }
		});
	}

	return typeorm.createConnection(options);
};

interface RunInsertQueryType extends Partial<jest.Mock> {
	(
		queryBuilder: (
			manager: typeorm.EntityManager,
			...params: any[]
		) => Promise<typeorm.InsertResult>,
		params: any[],
		manager?: typeorm.EntityManager
	): Promise<typeorm.ObjectLiteral[]>;
}

export const runInsertQuery: RunInsertQueryType = async (
	queryBuilder: (
		manager: typeorm.EntityManager,
		...params: any[]
	) => Promise<typeorm.InsertResult>,
	params: any[],
	manager?: typeorm.EntityManager
) => {
	const getQueryResults = async (entityManager: typeorm.EntityManager) => {
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

export const checkDatabaseExistsQuery = (manager: typeorm.EntityManager) => {
	return manager.createQueryBuilder(Users, 'users').limit(1).execute();
};

export const checkIfDataBaseExists = async () => {
	try {
		await runQuery(checkDatabaseExistsQuery);
		return true;
	} catch {
		return false;
	}
};

export const addUserAsSuperAdmin = async (manager: typeorm.EntityManager) => {
	const profile: IAddUserProfile = {
		biography: '',
		dob: new Date(),
		email: Constants.app.MAIL_USER || '',
		image: '',
		isEmailVerified: true,
		name: '',
		password: bcryptJs.hashSync(Constants.app.MAIL_PASSWORD || '', 12),
		phoneNumber: '',
		roles: [Constants.privileges.SUPER_ADMIN, Constants.privileges.USER],
		username: '',
		verificationCode: ''
	};
	await runInsertQuery(addUserProfileQuery, [profile], manager);
	return true;
};

export const createCircleSuperAdmin = async () => {
	const totalSuperAdmins = await runQuery(countExistingSuperAdminQuery);
	if (totalSuperAdmins) return;
	await runInTransaction(addUserAsSuperAdmin);
};

export const createDBSchema = async () => {
	try {
		const exists = await checkIfDataBaseExists();
		if (exists) return { state: 'exists', success: true };
		await runInTransaction((manager) => {
			return manager.connection.synchronize();
		});
		return { state: 'created', success: true };
	} catch (error) {
		return { state: 'failed', success: false };
	}
};

export const setupCircleDatabase = async () => {
	const { state } = await createDBSchema();
	if (state === 'failed') return;
	await createCircleSuperAdmin();
};
