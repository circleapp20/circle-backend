import { SERVER } from 'base/config/server';
import {
	decodeAuthToken,
	getDecodedAuthTokenInHeaders,
	getSignedAuthToken,
	verifyAuthToken
} from 'base/utils/server/validation';
import jwt from 'jsonwebtoken';

beforeEach(() => jest.clearAllMocks());

describe('#getSignedAuthToken', () => {
	const signMock = jest.spyOn(jwt, 'sign');

	test('should return a signed auth token', () => {
		const token = getSignedAuthToken('test');
		expect(token).toBeDefined();
	});

	test('should sign token with secret key', () => {
		getSignedAuthToken('test');
		expect(signMock).toHaveBeenCalledWith('test', SERVER.app.SECRET, undefined);
	});

	test('should create token from data', () => {
		getSignedAuthToken('testing-data');
		expect(signMock).toHaveBeenCalledWith('testing-data', SERVER.app.SECRET, undefined);
	});

	test('should create token from object with noTimestamp true', () => {
		const data = { id: 'cu73-483-jcu39k2' };
		getSignedAuthToken(data);
		expect(signMock).toHaveBeenCalledWith(data, SERVER.app.SECRET, {
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

	test('should return null if decode throws', () => {
		const decodeMock = jest.spyOn(jwt, 'decode');
		decodeMock.mockImplementationOnce(() => {
			throw new Error();
		});
		const result = decodeAuthToken('ih298ht3h9h398');
		decodeMock.mockRestore();
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
