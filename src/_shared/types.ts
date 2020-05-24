export interface IError extends Error {
	status: number;
	errCode: string;
}
