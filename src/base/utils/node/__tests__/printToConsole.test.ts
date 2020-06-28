import { printToConsole } from 'base/utils/node/printToConsole';

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
