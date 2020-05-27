import express from 'express';
import 'reflect-metadata';
import { bootstrap } from './bootstrap';
import { Constants } from './_shared/constants';
import { printToConsole } from './_shared/services/utilities';

bootstrap(express(), () => printToConsole(`Server running on port ${Constants.app.PORT}`));
