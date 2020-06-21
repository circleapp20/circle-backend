import { getBadRequestError } from 'base/common/errors';
import * as sharedQueries from 'base/node/queries';
import { runQuery } from 'core/node/database/queryRunners';
import { decryptData } from 'core/node/encryption';

export const getUserProfileById = async (id: string) => {
	const user = await runQuery(sharedQueries.getUserByIdQuery, [id]);
	if (!user) throw getBadRequestError('Invalid user account');
	const { password, verificationCode, ...other } = user;
	const decryptedVerificationCode = decryptData({ encryptedText: verificationCode });
	return Object.assign({}, other, { verificationCode: decryptedVerificationCode });
};
