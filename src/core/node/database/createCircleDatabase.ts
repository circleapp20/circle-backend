import { Users } from 'base/common/schema/users';
import { runInTransaction, runQuery } from 'core/node/database/queryRunners';
import * as typeorm from 'typeorm';
import { createCircleSuperAdmin } from './createSuperAdmin';

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
