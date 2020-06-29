import { SERVER } from 'base/config/server';
import { errorHandlerMiddleware } from 'base/utils/errors/node/errorHandlerMiddleware';
import { getServerError } from 'base/utils/errors/node/serverError';

describe('#errorHandlerMiddleware', () => {
	const response: any = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn()
	};

	const req: any = {};
	const nextMock: any = jest.fn();

	test('should send a status of 500 as a response status', () => {
		const error = getServerError();
		errorHandlerMiddleware(error, req, response, nextMock);
		expect(response.status).toBeCalled();
		expect(response.status).toBeCalledWith(SERVER.status.SERVER_ERROR);
	});

	test('should send status from error object', () => {
		const error = getServerError();
		errorHandlerMiddleware(error, req, response, nextMock);
		expect(response.status).toBeCalledWith(SERVER.status.SERVER_ERROR);
	});

	test('should send a json response with the error object', () => {
		const error = getServerError();
		errorHandlerMiddleware(error, req, response, nextMock);
		expect(response.json).toBeCalled();
		expect(response.json).toBeCalledWith({
			data: {
				status: SERVER.status.SERVER_ERROR,
				errCode: 'ERR_INTERNAL_SERVER_ERROR',
				message: error.message,
				stack: error.stack
			},
			success: false
		});
	});
});
