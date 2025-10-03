import 'reflect-metadata';
import express from 'express';
import { router } from './routes.js';

// Export an express app without starting the server to be used by Supertest
const app = express();
app.use(express.json());
app.use(router);

export { app };
