import axios from 'axios';
import { getSecureAxiosInstance } from 'base/apiService/common/getSecureAxiosInstance';

jest.mock('axios', () => ({
	create: jest.fn()
}));

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
