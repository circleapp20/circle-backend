import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Constants } from '../constants';
import { IAuthUser, IRequest } from '../types';
import { getForbiddenError, getUnauthorizedError } from './errorService';

export const getSignedAuthToken = (
	data: string | Record<string, unknown>,
	options: Record<string, unknown> | undefined = { noTimestamp: true }
) => {
	if (typeof data === 'string') {
		options = undefined;
	}
	return jwt.sign(data, Constants.app.SECRET, options);
};

export const verifyAuthToken = (token: string) => {
	try {
		const result = jwt.verify(token, Constants.app.SECRET);
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

export const authorizedApiRoute = (roles?: string[]) => {
	return (req: IRequest, _: Response, next: NextFunction) => {
		if (!roles) return next();

		const user = getDecodedAuthTokenInHeaders(req.headers);
		if (!user) throw getForbiddenError();

		const isAccessible = user.roles.some((role) => roles.includes(role));
		if (!isAccessible) throw getForbiddenError();

		req.user = user;

		next();
	};
};

// 050 143 1230
// circle.inc@yahoo.com
