import { getSecureAxiosInstance } from 'base/apiService/common/getSecureAxiosInstance';

export const apiGet = async (url: string, service = '', headers = {}) => {
	const secureAxios = getSecureAxiosInstance(service, headers);
	const response = await secureAxios.get(url);
	return response.data;
};
