import { IResponseData } from '../types';

export const generateRandomValue = () => {
	return Math.floor(Math.random() * 10e6);
};

// generateCodeFromNumber function generates a text from the value
// if the value is not provided, a random value is generate using
// generateRandomValue function and returns it's code
export const generateCodeFromNumber = (value?: number) => {
	const codeNumber = value ? value : generateRandomValue();
	return codeNumber.toString(32);
};

export const getResponseData = <T = any>(data?: T, success = true) => {
	const response: IResponseData<T> = { success };
	if (data) response.data = data;
	return response;
};

export const printToConsole = (args: any) => {
	const date = new Date().toDateString();
	console.log(`[${date}]:circle - ${args}`);
};
