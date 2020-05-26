import { Request, Response } from 'express';

export const verifyUserCredentials = async (_: Request, res: Response) => {
	res.status(201).json({ data: { text: 'hello world' } });
};
