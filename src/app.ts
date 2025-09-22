import express from 'express';
import { getHandler, postHandler } from './handlers';

const app = express();

app.use(express.json());

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
