import { generateCodeFromNumber } from '../utilities';

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
			const codes = Array.from(Array(50), (_, idx) => generateCodeFromNumber(idx));
			const matchingCodes = codes.filter((code, _, arr) => {
				const frequency = arr.filter((c) => c === code).length;
				return frequency > 1;
			});
			expect(matchingCodes.length).toBe(0);
		});
	});
});
