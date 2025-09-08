import express, { Request, Response } from 'express';
import { getRandomString, maskCipherToken } from './utils.ts';

const app = express();

app.get('/csrf', (req: Request, res: Response) => {
  const csrfSecret = getRandomString();
  res.cookie('csrftoken', csrfSecret);
  res.set('X-CSRF-Token', maskCipherToken(csrfSecret));
  res.json({ message: 'Cool' });
});

export default app;
