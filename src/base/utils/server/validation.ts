import { SERVER } from 'base/config/server';
import { IAuthUser } from 'base/types';
import { getUnauthorizedError } from 'base/utils/errors/node/unauthorizedError';
import jwt from 'jsonwebtoken';

export const getSignedAuthToken = (
	data: string | Record<string, unknown>,
	options: Record<string, unknown> | undefined = { noTimestamp: true }
) => {
	if (typeof data === 'string') {
		options = undefined;
	}
	return jwt.sign(data, SERVER.app.SECRET, options);
};

export const verifyAuthToken = (token: string) => {
	try {
		const result = jwt.verify(token, SERVER.app.SECRET);
		return Boolean(result);
	} catch (error) {
		return false;
	}
};

export const decodeAuthToken = <T = any>(token: string): T | null => {
	try {
		const result = jwt.decode(token);
		return result as T;
	} catch (error) {
		return null;
	}
};

export const getDecodedAuthTokenInHeaders = (headers: { authorization?: string }) => {
	const { authorization } = headers;
	if (!authorization) throw getUnauthorizedError();
	if (!authorization.startsWith('Bearer')) {
		throw getUnauthorizedError('Invalid authorization header format');
	}
	const [, token] = authorization.split(' ');
	return verifyAuthToken(token) ? decodeAuthToken<IAuthUser>(token) : null;
};
