import axios from 'axios';
import { apiPost, getSecureAxiosInstance } from 'shared/common/apiActions';

jest.mock('axios', () => ({
	create: jest.fn()
}));

beforeEach(() => jest.clearAllMocks());

describe('#getSecureAxiosInstance', () => {
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
	const post = jest.fn(async () => ({ data: 'test' }));

	beforeAll(() => {
		(axios.create as any).mockReturnValue({ post });
	});

	test('should send post request to url with data', async () => {
		await apiPost('/api/v1/auth/users', { id: '20ht2jc0m93j49' });
		expect(post).toHaveBeenCalledWith('/api/v1/auth/users', { id: '20ht2jc0m93j49' });
	});

	test('should return data in response', async () => {
		const response = await apiPost('/test/url', 'test');
		expect(response).toBe('test');
	});

	test('should return null if post request fails', async () => {
		post.mockRejectedValueOnce(new Error());
		const response = await apiPost('/test/url', 'test');
		expect(response).toBeNull();
	});

	test('should post request to service', async () => {
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
