import { SERVER } from 'base/config/server';
import { IAddUserProfile } from 'base/types';
import { generateCodeFromNumber } from 'base/utils/node/codeGenerator';
import bcryptJs from 'bcryptjs';
import { runInsertQuery, runInTransaction, runQuery } from 'core/database/queryRunners';
import { encryptData } from 'core/encryption/node/encryption';
import { countExistingSuperAdminQuery } from 'core/queries/adminQueries';
import { addUserToFellowsQuery } from 'core/queries/fellowQueries';
import { addUserProfileQuery } from 'core/queries/userQueries';
import * as typeorm from 'typeorm';

export const addUserAsSuperAdmin = async (manager: typeorm.EntityManager) => {
	const profile: IAddUserProfile = {
		biography: '',
		dob: new Date(),
		email: SERVER.app.MAIL_USER || '',
		image: '',
		isEmailVerified: true,
		name: '',
		password: bcryptJs.hashSync(SERVER.app.MAIL_PASSWORD || '', 12),
		phoneNumber: '',
		roles: [
			SERVER.privileges.SUPER_ADMIN,
			SERVER.privileges.USER,
			SERVER.privileges.LEAD_FELLOW,
			SERVER.privileges.FELLOW
		],
		username: '',
		verificationCode: ''
	};

	const [user] = await runInsertQuery(addUserProfileQuery, [profile], manager);

	const secretCode = generateCodeFromNumber();
	const encryptedSecretCode = encryptData({ text: secretCode });

	await runInsertQuery(
		addUserToFellowsQuery,
		[{ id: user.id, secretCode: encryptedSecretCode }],
		manager
	);

	return true;
};

export const createCircleSuperAdmin = async () => {
	const totalSuperAdmins = await runQuery(countExistingSuperAdminQuery);
	if (totalSuperAdmins) return;
	await runInTransaction(addUserAsSuperAdmin);
};
