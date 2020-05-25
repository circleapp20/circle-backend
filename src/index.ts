import express from 'express';
import 'reflect-metadata';
import { bootstrap } from './bootstrap';
import { Constants } from './_shared/constants';

bootstrap(express(), () => console.log(`Server running on port ${Constants.app.PORT}`));
