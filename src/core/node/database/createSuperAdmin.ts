import { generateCodeFromNumber } from 'base/common/utilities';
import { Constants } from 'base/constants';
import {
	addUserProfileQuery,
	addUserToFellowsQuery,
	countExistingSuperAdminQuery
} from 'base/node/queries';
import { IAddUserProfile } from 'base/types';
import bcryptJs from 'bcryptjs';
import { runInsertQuery, runInTransaction, runQuery } from 'core/node/database/queryRunners';
import { encryptData } from 'core/node/encryption';
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
