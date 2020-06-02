module.exports = {
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules/'],
	collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
	testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/', '/.github'],
	transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
