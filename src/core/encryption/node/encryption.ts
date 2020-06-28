import { Constants } from 'base/config/node/constants';
import { memoize } from 'base/utils/common/functions';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export const generateHashedValue = memoize(bcryptjs.hashSync);

export const getHashedSecretKey = (maxLength?: number) => {
	const hashedKey = generateHashedValue(Constants.app.SECRET, Constants.misc.BCRYPT_HASHING_SALT);
	return hashedKey.slice(0, maxLength).padEnd(32, '0');
};

export const getCryptoIvBuffer = (maxLength?: number) => {
	const ivString = generateHashedValue(Constants.app.SECRET, 6);
	return Buffer.from(ivString.slice(0, maxLength));
};

interface IEncryptorOptions {
	algorithm?: string;
	encryptor?: typeof crypto;
	maxLength?: number;
	iv?: string;
}

export const getCryptoCipherAndDecipher = (args: IEncryptorOptions) => {
	const { algorithm = 'aes-256-gcm', encryptor = crypto, maxLength = 32, iv } = args;
	const key = getHashedSecretKey(maxLength);
	const hashedSecretKeyBuffer = Buffer.from(key);
	const ivBuffer = (iv && Buffer.from(iv, 'hex')) || getCryptoIvBuffer(maxLength);
	const cipher = encryptor.createCipheriv(algorithm, hashedSecretKeyBuffer, ivBuffer);
	const decipher = encryptor.createDecipheriv(algorithm, hashedSecretKeyBuffer, ivBuffer);
	return { cipher, decipher, iv: ivBuffer };
};

interface IEncryptionOptions extends IEncryptorOptions {
	text: string;
}

export const encryptData = (args: IEncryptionOptions) => {
	const { text, ...other } = args;
	const { cipher, iv } = getCryptoCipherAndDecipher(other);
	const encryptedText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
	const tag = (<any>cipher).getAuthTag();
	return `${encryptedText}%%${tag.toString('hex')}%%${iv.toString('hex')}`;
};

interface IDecryptionOptions extends IEncryptorOptions {
	encryptedText: string;
}

export const decryptData = (args: IDecryptionOptions) => {
	const { encryptedText, ...other } = args;
	const [text, tag, iv] = encryptedText.split('%%');
	const { decipher } = getCryptoCipherAndDecipher(Object.assign({}, other, { iv }));
	(<any>decipher).setAuthTag(Buffer.from(tag, 'hex'));
	return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
};
