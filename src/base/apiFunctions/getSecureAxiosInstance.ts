import axios from 'axios';

export const getSecureAxiosInstance = (baseURL: string, headers: Record<string, any> = {}) => {
	return axios.create({
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			...headers
		},
		baseURL
	});
};
