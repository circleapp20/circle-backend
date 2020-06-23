import axios from 'axios';
import { apiPost } from 'base/apiService/common/apiAxiosPost';

jest.mock('axios', () => ({
	create: jest.fn()
}));

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
		post.mockRejectedValueOnce(new Error('Request Failed'));
		expect(apiPost('/test/url', 'test')).rejects.toThrowError('Request Failed');
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
