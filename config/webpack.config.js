const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /(node_modules|__tests__|__mocks__)/,
				options: { configFile: 'tsconfig.server.json' }
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.json', '.js'],
		plugins: [new TsConfigPathsPlugin()]
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'index.js'
	},
	externals: [nodeExternals()]
};
