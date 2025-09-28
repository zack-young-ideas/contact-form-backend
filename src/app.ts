import express from 'express';
import cookieParser from 'cookie-parser';
import validateCsrf from './middleware';
import { getHandler, postHandler } from './routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(validateCsrf);

app.disable('x-powered-by');

app.get('/csrf', getHandler);

app.post('/contact', postHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((req, res) => {
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
