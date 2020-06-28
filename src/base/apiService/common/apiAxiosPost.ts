import { getSecureAxiosInstance } from 'base/apiService/common/getSecureAxiosInstance';

export const apiPost = async (url: string, data: any, service = '', headers = {}) => {
	const secureAxios = getSecureAxiosInstance(service, headers);
	const response = await secureAxios.post(url, data);
	return response.data;
};
