export interface IResponseData<T = any> {
	data?: T;
	success: boolean;
}

export const getResponseData = <T = any>(data?: T, success = true) => {
	const response: IResponseData<T> = { success };
	if (typeof data !== 'undefined') response.data = data;
	return response;
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
