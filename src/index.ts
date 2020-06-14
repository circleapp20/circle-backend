import express from 'express';
import 'reflect-metadata';
import { printToConsole } from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import { bootstrap } from './bootstrap';

const main = () => {
	bootstrap(express(), () => printToConsole(`Server running on port ${Constants.app.PORT}`));
};

main();
