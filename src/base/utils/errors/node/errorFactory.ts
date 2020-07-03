import { IError } from 'base/types';

export const getErrorFactory = (
	message: string,
	status: number,
	errCode: string,
	name?: string
) => {
	const error = new Error(message);
	const obj: IError = {
		message: error.message,
		status,
		errCode,
		name: name || error.name
	};
	if (process.env.NODE_ENV !== 'production') {
		obj.stack = error.stack;
	}
	return obj;
};
