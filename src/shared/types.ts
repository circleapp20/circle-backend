import { Schema } from '@hapi/joi';
import { Request, Response } from 'express';

export interface IError extends Error {
	status: number;
	errCode: string;
	error?: any;
}

export interface IRequest extends Request {
	user: IAuthUser;
}

export interface IApiRoute {
	path: string;
	method: 'get' | 'post' | 'put' | 'delete';
	controller: (req: IRequest, res: Response) => Promise<void>;
	privileges?: string[];
	schema?: Schema;
	type?: 'body' | 'query';
}

export interface IResponseData<T = any> {
	data?: T;
	success: boolean;
}

export interface IRecipientMailConfig {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export interface IAuthUser {
	id: string;
	roles: string[];
}

export interface IAddUserProfile {
	username: string;
	password: string;
	dob: Date;
	image: string;
	biography: string;
	email: string;
	phoneNumber: string;
	isEmailVerified: boolean;
	verificationCode: string;
	roles: string[];
	name: string;
}
