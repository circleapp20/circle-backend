import { IResponseData } from '../types';

export const generateRandomValue = () => {
	return Math.floor(Math.random() * 10e7);
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
	if (typeof data !== 'undefined') response.data = data;
	return response;
};

export const printToConsole = (args: any) => {
	const date = new Date().toUTCString();
	console.log(`[${date}]:circle-backend - ${String(args).toString()}`);
};

export const getMetaDataFromDataURI = (
	dataUri: string,
	mimeType = 'image/jpeg',
	encoding = 'data:image/jpeg;base64'
) => {
	if (dataUri.startsWith('data')) {
		mimeType = dataUri.slice(11, 12) === 'j' ? 'image/jpeg' : 'image/png';
		encoding = `data:${mimeType};base64,`;
	}
	const data = dataUri.replace(encoding, '');
	return { uri: data, contentType: mimeType };
};
