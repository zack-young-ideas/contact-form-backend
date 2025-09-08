import express, { Request, Response } from 'express';
import { getRandomString } from './utils.ts';

const app = express();

app.get('/csrf', (req: Request, res: Response) => {
  res.set('X-CSRF-Token', getRandomString());
  res.json({ message: 'Cool' });
});

export default app;
