import jwt from 'jsonwebtoken';
import { Constants } from '../../constants';
import {
	authorizedApiRoute,
	decodeAuthToken,
	getDecodedAuthTokenInHeaders,
	getSignedAuthToken,
	verifyAuthToken
} from '../authService';

beforeEach(() => jest.clearAllMocks());

describe('#authService', () => {
	describe('#getSignedAuthToken', () => {
		const signMock = jest.spyOn(jwt, 'sign');

		test('should return a signed auth token', () => {
			const token = getSignedAuthToken('test');
			expect(token).toBeDefined();
		});

		test('should sign token with secret key', () => {
			getSignedAuthToken('test');
			expect(signMock).toHaveBeenCalledWith('test', Constants.app.SECRET, undefined);
		});

		test('should create token from data', () => {
			getSignedAuthToken('testing-data');
			expect(signMock).toHaveBeenCalledWith('testing-data', Constants.app.SECRET, undefined);
		});

		test('should create token from object with noTimestamp true', () => {
			const data = { id: 'cu73-483-jcu39k2' };
			getSignedAuthToken(data);
			expect(signMock).toHaveBeenCalledWith(data, Constants.app.SECRET, {
				noTimestamp: true
			});
		});
	});

	describe('#verifyAuthToken', () => {
		test('should validate token successfully', () => {
			const token = getSignedAuthToken('test');
			const result = verifyAuthToken(token);
			expect(result).toBeTruthy();
		});

		test('should return false if token validation failed', () => {
			const result = verifyAuthToken('93ne9392if09');
			expect(result).toBeFalsy();
		});
	});

	describe('#decodeAuthToken', () => {
		test('should decode token successfully', () => {
			const token = getSignedAuthToken('test');
			const result = decodeAuthToken(token);
			expect(result).toBe('test');
		});

		test('should return null for invalid token', () => {
			const result = decodeAuthToken('ih298ht3h9h398');
			expect(result).toBeNull();
		});
	});

	describe('#getDecodedAuthTokenInHeaders', () => {
		const wrapper = (authorization: string) => {
			try {
				return getDecodedAuthTokenInHeaders({ authorization });
			} catch (error) {
				throw error.message;
			}
		};

		test('should return data in auth token', () => {
			const token = getSignedAuthToken('test');
			const result = wrapper(`Bearer ${token}`);
			expect(result).toBe('test');
		});

		test('should throw unauthorized error for no authorization', () => {
			expect(wrapper).toThrowError('Unauthorized access');
		});

		test('should throw error for bad token format', () => {
			expect(() => wrapper('own4wnf6wo')).toThrowError('Invalid authorization header format');
		});
	});

	describe('#authorizedApiRoute', () => {
		const req: any = { body: {}, headers: {} };
		const res: any = {};
		const next = jest.fn();

		test('should skip middleware for undefined roles', () => {
			const middleware = authorizedApiRoute();
			middleware(req, res, next);
			expect(next).toHaveBeenCalled();
		});

		test('should throw when user is null', () => {
			const middleware = authorizedApiRoute([]);
			expect(() => {
				req.headers.authorization = 'Bearer l4sfn784ow5en7io4vo84nw4038gnw';
				middleware(req, res, next);
			}).toThrow();
		});

		test('should throw when user does not have access', () => {
			const middleware = authorizedApiRoute(['super_admin']);
			expect(() => {
				const token = getSignedAuthToken({ roles: ['user'] });
				req.headers.authorization = `Bearer ${token}`;
				middleware(req, res, next);
			}).toThrow();
		});

		test('should add token data to req body as user field', () => {
			const middleware = authorizedApiRoute(['super_admin']);
			const token = getSignedAuthToken({ roles: ['super_admin'] });
			req.headers.authorization = `Bearer ${token}`;
			middleware(req, res, next);
			expect(req.body.user).toEqual({ roles: ['super_admin'] });
			expect(next).toHaveBeenCalled();
		});
	});
});
