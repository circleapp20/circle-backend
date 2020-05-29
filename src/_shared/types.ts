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
	controller: (req: any, res: Response) => Promise<void>;
	privileges?: string[];
	schema?: Schema;
}

export interface IResponseData<T = any> {
	data?: T;
	success: boolean;
}

export interface IRecipientMaiConfig {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export interface IAuthUser {
	id: string;
	roles: string[];
}
