import express from 'express';
import { getHandler, postHandler } from './handlers.ts';

const app = express();

app.use(express.json());

app.get('/csrf', getHandler);

app.post('/contact', postHandler);

export default app;
