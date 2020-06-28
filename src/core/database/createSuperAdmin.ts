import { Constants } from 'base/config/node/constants';
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
		email: Constants.app.MAIL_USER || '',
		image: '',
		isEmailVerified: true,
		name: '',
		password: bcryptJs.hashSync(Constants.app.MAIL_PASSWORD || '', 12),
		phoneNumber: '',
		roles: [
			Constants.privileges.SUPER_ADMIN,
			Constants.privileges.USER,
			Constants.privileges.LEAD_FELLOW,
			Constants.privileges.FELLOW
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
