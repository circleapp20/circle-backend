import axios from 'axios';
import * as apiService from '../apiService';
import { apiPost, getSecureAxiosInstance } from '../apiService';

jest.mock('axios', () => ({
	create: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#apiService', () => {
	describe('#getSecureAxiosInstance', () => {
		beforeEach(() => {
			(axios.create as any).mockRestore();
		});

		test('should create an axios instance with default config', () => {
			getSecureAxiosInstance('https://api.circleapp.com');
			expect(axios.create).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						accept: expect.stringMatching('application/json'),
						'content-type': expect.stringMatching('application/json')
					}),
					baseURL: expect.stringMatching('https://api.circleapp.com')
				})
			);
		});

		test('should add headers to axios instance headers', () => {
			getSecureAxiosInstance('https://api.circleapp.com', {
				authorization: 'Bearer 23j3g3nf93n3j893g9n'
			});
			expect(axios.create).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						accept: expect.stringMatching('application/json'),
						'content-type': expect.stringMatching('application/json'),
						authorization: expect.any(String)
					}),
					baseURL: expect.stringMatching('https://api.circleapp.com')
				})
			);
		});
	});

	describe('#apiPost', () => {
		let postMock: jest.Mock;
		let instanceMock: jest.SpyInstance;

		beforeEach(() => {
			postMock = jest.fn();
			instanceMock = jest.spyOn(apiService, 'getSecureAxiosInstance');
			instanceMock.mockReturnValue({ post: postMock });
		});

		test('should send post request to url with data', async () => {
			await apiPost('/api/v1/auth/users', { id: '20ht2jc0m93j49' });
			expect(postMock).toHaveBeenCalledWith('/api/v1/auth/users', { id: '20ht2jc0m93j49' });
		});

		test('should return data in response', async () => {
			postMock.mockResolvedValueOnce({ data: 'testing data' });
			const response = await apiPost('/test/url', 'test');
			expect(response).toBe('testing data');
		});

		test('should return null if post request fails', async () => {
			postMock.mockRejectedValueOnce(new Error());
			const response = await apiPost('/test/url', 'test');
			expect(response).toBeNull();
		});

		test('should post request to service', async () => {
			instanceMock.mockRestore();
			await apiPost('/test/url', 'test', 'https://json.appservice.com');
			expect(axios.create).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						accept: expect.stringMatching('application/json'),
						'content-type': expect.stringMatching('application/json')
					}),
					baseURL: expect.stringMatching('https://json.appservice.com')
				})
			);
		});

		test('should add unique headers for post request', async () => {
			instanceMock.mockRestore();
			await apiPost('/test/url', 'test', 'https://json.appservice.com', {
				authorization: 'testing header bro'
			});
			expect(axios.create).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						authorization: expect.any(String),
						accept: expect.stringMatching('application/json'),
						'content-type': expect.stringMatching('application/json')
					}),
					baseURL: expect.stringMatching('https://json.appservice.com')
				})
			);
		});
	});
});
