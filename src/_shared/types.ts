import { Request, Response } from 'express';

export interface IError extends Error {
	status: number;
	errCode: string;
}

export interface IApiRoute {
	path: string;
	method: 'get' | 'post' | 'put' | 'delete';
	controller: (req: Request, res: Response) => Promise<void>;
}
