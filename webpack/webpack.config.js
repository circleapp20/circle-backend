const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /(node_modules|__tests__|__mocks__)/,
				options: { configFile: 'tsconfig.server.json', transpileOnly: true }
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
	externals: [nodeExternals({ modulesFromFile: true })],
	target: 'node',
	stats: 'errors-only',
	plugins: [new CleanWebpackPlugin(), new WebpackBar()],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					ecma: 8,
					keep_classnames: true,
					keep_fnames: true,
					module: true,
					mangle: {
						module: true,
						keep_classnames: true,
						keep_fnames: true
					}
				}
			})
		]
	}
};
