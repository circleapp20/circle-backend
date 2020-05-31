module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFiles: ['<rootDir>/src/setupTests.ts'],
	coveragePathIgnorePatterns: ['/node_modules/'],
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.server.json'
		}
	},
	collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
	testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/', '/.github'],
	transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$']
};
