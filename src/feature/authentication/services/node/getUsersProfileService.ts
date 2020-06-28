import { getBadRequestError } from 'base/errors/node/badRequestError';
import { runQuery } from 'core/database/queryRunners';
import { decryptData } from 'core/encryption/node/encryption';
import { getUserByIdQuery } from 'core/queries/userQueries';

export const getUserProfileById = async (id: string) => {
	const user = await runQuery(getUserByIdQuery, [id]);
	if (!user) throw getBadRequestError('Invalid user account');
	const { password, verificationCode, ...other } = user;
	const decryptedVerificationCode = decryptData({ encryptedText: verificationCode });
	return Object.assign({}, other, { verificationCode: decryptedVerificationCode });
};
