import { generateCodeFromNumber, getResponseData, printToConsole } from '../utilities';

describe('#utilities', () => {
	describe('#generateCodeFromNumber', () => {
		test('should generate text from the number', () => {
			const code = generateCodeFromNumber(10e6);
			expect(code).toBe('9h5k0');
		});

		test('should generate a random text if non is present', () => {
			const code = generateCodeFromNumber();
			const isString = typeof code === 'string';
			expect(isString).toBeTruthy();
			expect(code.length).not.toBe(0);
		});

		test('should not generate same code more than once', () => {
			const codes = Array.from(Array(10), (_, idx) => generateCodeFromNumber(idx));
			const matchingCodes = codes.filter((code, _, arr) => {
				const frequency = arr.filter((c) => c === code).length;
				return frequency > 1;
			});
			expect(matchingCodes.length).toBe(0);
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
			expect(logMock).toHaveBeenCalledTimes(1);
			const text = `[${new Date().toUTCString()}]:circle-backend - testing print`;
			expect(logMock).toHaveBeenCalledWith(text);
			logMock.mockRestore();
		});
	});
});
