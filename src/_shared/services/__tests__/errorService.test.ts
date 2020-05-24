import { errorMiddleware, ForbiddenError, ServerError } from '../errorService';

beforeAll(() => jest.clearAllMocks());

describe('#errorService', () => {
	describe('#ServerError', () => {
		test('should be an instance of Error class', () => {
			const error = new ServerError();
			expect(error).toBeInstanceOf(Error);
		});

		test('should have a status of 500', () => {
			const error = new ServerError();
			expect(error.status).toBe(500);
		});

		test('should have an errCode of ERR_INTERNAL_SERVER_ERROR', () => {
			const error = new ServerError();
			expect(error.errCode).toBe('ERR_INTERNAL_SERVER_ERROR');
		});

		test('should have a message', () => {
			const error = new ServerError();
			expect(error.message).toBe('An error occurred whilst processing request');
		});

		test('should have the message from the constructor', () => {
			const error = new ServerError('Testing message');
			expect(error.message).toBe('Testing message');
		});
	});

	describe('#ForbiddenError', () => {
		test('should be an instance of Error class', () => {
			const error = new ForbiddenError();
			expect(error).toBeInstanceOf(Error);
		});

		test('should have a status of 403', () => {
			const error = new ForbiddenError();
			expect(error.status).toBe(403);
		});

		test('should have an errCode of ERR_FORBIDDEN_ACCESS', () => {
			const error = new ForbiddenError();
			expect(error.errCode).toBe('ERR_FORBIDDEN_ACCESS');
		});

		test('should have a message', () => {
			const error = new ForbiddenError();
			expect(error.message).toBe('Access forbidden');
		});
	});

	describe('#errorMiddleware', () => {
		const response: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};

		const req: any = {};
		const nextMock: any = jest.fn();

		test('should send a status of 500 as a response status', () => {
			const error = new ServerError();
			errorMiddleware(error, req, response, nextMock);
			expect(response.status).toBeCalled();
			expect(response.status).toBeCalledWith(500);
		});

		test('should send status from error object', () => {
			const error = new ForbiddenError();
			errorMiddleware(error, req, response, nextMock);
			expect(response.status).toBeCalledWith(403);
		});

		test('should send a json response with the error object', () => {
			const error = new ServerError();
			errorMiddleware(error, req, response, nextMock);
			expect(response.json).toBeCalled();
			expect(response.json).toBeCalledWith({
				data: { status: 500, errCode: 'ERR_INTERNAL_SERVER_ERROR', message: error.message },
				success: false
			});
		});
	});
});
