import jwt from 'jsonwebtoken';
import { Constants } from '../../constants';
import { getSignedAuthToken } from '../authService';

describe('#authService', () => {
	describe('#getSignedAuthToken', () => {
		test('should return a signed auth token', () => {
			const token = getSignedAuthToken('test');
			expect(token).toBeDefined();
		});

		test('should sign token with secret key', () => {
			const signMock = jest.spyOn(jwt, 'sign');
			signMock.mockImplementation();
			getSignedAuthToken('test');
			expect(signMock).toHaveBeenCalledWith('test', Constants.app.SECRET);
		});

		test('should create token from data', () => {
			const signMock = jest.spyOn(jwt, 'sign');
			signMock.mockImplementation();
			getSignedAuthToken('testing-data');
			expect(signMock).toHaveBeenCalledWith('testing-data', Constants.app.SECRET);
		});
	});
});
