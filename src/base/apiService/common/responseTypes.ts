export interface IApiDataResponse<T = any> {
	data: T | null;
	error?: string;
}

export interface IApiSuccessResponse {
	success?: boolean;
	error?: string;
}
