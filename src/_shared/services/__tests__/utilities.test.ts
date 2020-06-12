import {
	generateCodeFromNumber,
	getMetaDataFromDataURI,
	getResponseData,
	printToConsole
} from '../utilities';

describe('#utilities', () => {
	describe('#generateCodeFromNumber', () => {
		test('should generate text from the number', () => {
			const code = generateCodeFromNumber(10e7);
			expect(code).toBe('2vbo80');
		});

		test('should generate a random text if non is present', () => {
			const code = generateCodeFromNumber();
			expect(code).toEqual(expect.any(String));
		});

		test('should not have . in generated code', () => {
			const code = generateCodeFromNumber();
			expect(code.includes('.')).not.toBeTruthy();
		});

		test('should generate code with only 6 characters', () => {
			const code = generateCodeFromNumber();
			expect(code.length).toBe(6);
		});
	});

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

	describe('#printToConsole', () => {
		test('prints strings to console', () => {
			const logMock = jest.spyOn(console, 'log').mockImplementation();
			printToConsole('testing print');
			const text = `\x1b[32m[${new Date().toUTCString()}] [INFO] [circle] -\x1b[0m testing print`;
			expect(logMock).toHaveBeenCalledWith(text);
		});

		test('should add the level to the console', () => {
			const logMock = jest.spyOn(console, 'log').mockImplementation();
			printToConsole('testing print', 'ERROR');
			const text = `\x1b[32m[${new Date().toUTCString()}] [ERROR] [circle] -\x1b[0m testing print`;
			expect(logMock).toHaveBeenCalledWith(text);
		});

		test('should print the stringified object', () => {
			const logMock = jest.spyOn(console, 'log').mockImplementation();
			const obj = { hello: 'world' };
			printToConsole(obj);
			const text = `\x1b[32m[${new Date().toUTCString()}] [INFO] [circle] -\x1b[0m ${JSON.stringify(
				obj,
				null,
				2
			)}`;
			expect(logMock).toHaveBeenCalledWith(text);
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
});
