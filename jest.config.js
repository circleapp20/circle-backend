module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFiles: ['./src/setupTests.ts'],
	coveragePathIgnorePatterns: ['/node_modules/'],
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.server.json'
		}
	}
};
