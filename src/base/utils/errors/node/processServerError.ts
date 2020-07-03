import { SERVER } from 'base/config/server';
import { IError } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';

export const processServerError = (error: Partial<IError>) => {
	let {
		status = SERVER.status.SERVER_ERROR,
		errCode = 'ERR_INTERNAL_SERVER_ERROR',
		message
	} = error;
	if (error.error && error.error.isJoi) {
		status = SERVER.status.BAD_REQUEST;
		message = error.error.message;
		errCode = 'ERR_BAD_REQUEST';
	}
	let data = { status, errCode, message };
	if (process.env.NODE_ENV !== 'production') {
		const stack = error.stack;
		data = Object.assign({}, data, { stack });
	}
	return getResponseData(data, false);
};
