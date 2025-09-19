import express from 'express';
import { getHandler, postHandler } from './handlers';

const app = express();

app.use(express.json());

app.disable('x-powered-by');

app.get('/csrf', getHandler);

app.post('/contact', postHandler);

export default app;
