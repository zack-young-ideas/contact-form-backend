import express, { Request, Response } from 'express';
import { getRandomString, maskCipherToken } from './utils.ts';

const app = express();

app.use(express.json());

app.get('/csrf', (req: Request, res: Response) => {
  const csrfSecret = getRandomString();
  res.cookie('csrftoken', csrfSecret);
  res.set('X-CSRF-Token', maskCipherToken(csrfSecret));
  res.json({ message: 'Cool' });
});

app.post('/contact', (req: Request, res: Response) => {
  const data = req.body;
  const errors = [];
  const responseData = {};
  let status = 200;
  if (data.firstName.length === 0) {
    errors.push('Invalid first name');
    status = 400;
  }
  if (data.lastName.length === 0) {
    errors.push('Invalid last name');
    status = 400;
  }
  if (data.email.length === 0) {
    errors.push('Invalid email address');
    status = 400;
  }
  if (errors.length > 0) {
    responseData.errors = errors;
  }
  res.status(status).json(responseData);
});

export default app;
