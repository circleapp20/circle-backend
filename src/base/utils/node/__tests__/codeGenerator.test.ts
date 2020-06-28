import { generateCodeFromNumber } from 'base/utils/node/codeGenerator';

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
