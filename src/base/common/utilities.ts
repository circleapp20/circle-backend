import { IResponseData } from 'base/types';

export const generateRandomValue = () => {
	return Math.random();
};

// generateCodeFromNumber function generates a text from the value
// if the value is not provided, a random value is generate using
// generateRandomValue function and returns it's code
export const generateCodeFromNumber = (value?: number) => {
	const codeNumber = value ? value : generateRandomValue();
	return codeNumber.toString(32).replace('.', '').slice(0, 6);
};

export const getResponseData = <T = any>(data?: T, success = true) => {
	const response: IResponseData<T> = { success };
	if (typeof data !== 'undefined') response.data = data;
	return response;
};

export const printToConsole = (args: any, level = 'INFO') => {
	const timestamp = new Date().toUTCString();
	let textToPrint = args;
	if (typeof args === 'object' && !Array.isArray(args)) {
		textToPrint = JSON.stringify(args, null, 2);
	}
	console.log(`\x1b[32m[${timestamp}] [${level}] [circle] -\x1b[0m ${textToPrint}`);
};

export const getMetaDataFromDataURI = (dataUri: string) => {
	const obj = { uri: '', contentType: 'image/jpeg' };
	if (!dataUri) return obj;

	// trim edges for the data uri
	const trimmedDataURI = dataUri.trimStart().trimEnd();

	// check if trimmed data uri starts with data
	if (trimmedDataURI.startsWith('data')) {
		const contentType = trimmedDataURI.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)![0];
		const uri = trimmedDataURI.replace(`data:${contentType};base64,`, '');
		return { uri, contentType };
	}

	const uri = trimmedDataURI.replace('data:image/jpeg;base64,', '');
	return Object.assign({}, obj, { uri });
};
