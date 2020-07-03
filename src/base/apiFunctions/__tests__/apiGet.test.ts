import { apiGet } from 'base/apiFunctions/apiGet';
import { getSecureAxiosInstance } from 'base/apiFunctions/getSecureAxiosInstance';

jest.mock('base/apiFunctions/getSecureAxiosInstance');

describe('#apiGet', () => {
	let get: jest.Mock<any, any>;

	beforeAll(() => {
		get = jest.fn(() => ({ data: [] }));
		(<any>getSecureAxiosInstance).mockReturnValue({ get });
	});

	test('should create a new axios instance', async () => {
		await apiGet('/tests');
		expect(getSecureAxiosInstance).toHaveBeenCalled();
	});

	test('should call the get function from axios', async () => {
		await apiGet('/tests');
		expect(get).toHaveBeenCalledWith('/tests');
	});
});
