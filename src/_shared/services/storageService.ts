import { EntityManager } from 'typeorm';
import { getSqlInstance, runQuery } from './dBService';
import { Users } from './schemaService';

export const checkDatabaseExistsQuery = (manager: EntityManager) => {
	return manager.getRepository(Users).createQueryBuilder().getCount();
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
		const conn = await getSqlInstance('default', true);
		await conn.close();
		return { state: 'created', success: true };
	} catch (error) {
		return { state: 'failed', success: false };
	}
};
