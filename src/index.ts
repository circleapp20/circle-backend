import { printToConsole } from 'base/common/utilities';
import { Constants } from 'base/constants';
import express from 'express';
import 'reflect-metadata';
import { bootstrap } from './bootstrap';

const main = () => {
	bootstrap(express(), () => printToConsole(`Server running on port ${Constants.app.PORT}`));

	// if (process.env.NODE_ENV === 'development') {
	// 	process.on('unhandledRejection', (error) => {
	// 		throw error;
	// 	});

	// 	process.on('uncaughtException', () => {});
	// }
};

main();
