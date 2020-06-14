import { getServerError } from 'shared/common/errors';
import { Constants } from 'shared/constants';
import { errorMiddleware } from 'shared/node/errors';

describe('#errorMiddleware', () => {
	const response: any = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn()
	};

	const req: any = {};
	const nextMock: any = jest.fn();

	test('should send a status of 500 as a response status', () => {
		const error = getServerError();
		errorMiddleware(error, req, response, nextMock);
		expect(response.status).toBeCalled();
		expect(response.status).toBeCalledWith(Constants.status.SERVER_ERROR);
	});

	test('should send status from error object', () => {
		const error = getServerError();
		errorMiddleware(error, req, response, nextMock);
		expect(response.status).toBeCalledWith(Constants.status.SERVER_ERROR);
	});

	test('should send a json response with the error object', () => {
		const error = getServerError();
		errorMiddleware(error, req, response, nextMock);
		expect(response.json).toBeCalled();
		expect(response.json).toBeCalledWith({
			data: {
				status: Constants.status.SERVER_ERROR,
				errCode: 'ERR_INTERNAL_SERVER_ERROR',
				message: error.message,
				stack: error.stack
			},
			success: false
		});
	});
});
