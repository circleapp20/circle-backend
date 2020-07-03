import { getSecureAxiosInstance } from 'base/apiFunctions/getSecureAxiosInstance';

export const apiPost = async (url: string, data: any, service = '', headers = {}) => {
	const secureAxios = getSecureAxiosInstance(service, headers);
	const response = await secureAxios.post(url, data);
	return response.data;
};
