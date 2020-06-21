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

export const apiPost = async (url: string, data: any, service = '', headers = {}) => {
	try {
		const secureAxios = getSecureAxiosInstance(service, headers);
		const response = await secureAxios.post(url, data);
		return response.data;
	} catch (error) {
		return null;
	}
};
