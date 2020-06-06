import bcryptJs from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { Constants } from '../constants';
import { addUserProfileQuery } from './dataService';
import { getSqlInstance, runInsertQuery, runInTransaction, runQuery } from './dBService';
import { Users } from './schemaService';
import { IAddUserProfile } from './typeService';

export const checkDatabaseExistsQuery = (manager: EntityManager) => {
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

export const countExistingSuperAdminQuery = (manager: EntityManager) => {
	return manager
		.createQueryBuilder(Users, 'u')
		.where('u.roles LIKE :role')
		.setParameter('role', `%${Constants.privileges.SUPER_ADMIN}%`)
		.getCount();
};

export const addUserAsSuperAdmin = async (manager: EntityManager) => {
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
	if (!totalSuperAdmins) await runInTransaction(addUserAsSuperAdmin);
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

export const setupCircleDatabase = async () => {
	const { success } = await createDBSchema();
	if (!success) return;
	await createCircleSuperAdmin();
};
