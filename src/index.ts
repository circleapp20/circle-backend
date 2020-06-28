import { Constants } from 'base/config/node/constants';
import { printToConsole } from 'base/utils/node/printToConsole';
import express from 'express';
import 'reflect-metadata';
import { startServer } from './bootstrap/startServer';

const serverRunListener = () => printToConsole(`started running on port ${Constants.app.PORT}`);

const main = () => {
	const app = express();

	startServer(app, serverRunListener);

	// if (process.env.NODE_ENV === 'development') {
	// 	process.on('unhandledRejection', (error) => {
	// 		throw error;
	// 	});

	// 	process.on('uncaughtException', () => {});
	// }
};

main();
