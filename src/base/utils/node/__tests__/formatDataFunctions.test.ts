import { getMetaDataFromDataURI, getResponseData } from 'base/utils/node/formatDataFunctions';

describe('#getResponseData', () => {
	test('should return object with success and data field', () => {
		const response = getResponseData('testing');
		expect(response).toEqual({ data: 'testing', success: true });
	});

	test('should return object with only success if data is not provided', () => {
		const response = getResponseData();
		expect(response).toEqual({ success: true });
	});

	test('should return success of false if set to false', () => {
		const response = getResponseData(undefined, false);
		expect(response).toEqual({ success: false });
	});

	test('should return object with fields values set', () => {
		const response = getResponseData('testing', false);
		expect(response).toEqual({ data: 'testing', success: false });
	});
});

describe('#getMetaDataFromDataURI', () => {
	test('should return uri without data if dataUri starts with data', () => {
		const dataUri = 'data:image/jpeg;base64,/9j/4RiDRXhpZgAATU0AKgA';
		const { uri } = getMetaDataFromDataURI(dataUri);
		expect(uri.startsWith('data')).toBeFalsy();
	});

	test('should change contentType to image/png if uri is a png file', () => {
		const dataUri = 'data:image/png;base64,/9j/4RiDRXhpZgAATU0AKgA';
		const { contentType } = getMetaDataFromDataURI(dataUri);
		expect(contentType).toBe('image/png');
	});

	test('should have default content type if uri has no data', () => {
		const dataUri = '/9j/4RiDRXhpZgAATU0AKgA';
		const { contentType } = getMetaDataFromDataURI(dataUri);
		expect(contentType).toBe('image/jpeg');
	});
});
