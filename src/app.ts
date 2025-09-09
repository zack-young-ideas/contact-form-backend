import express, { Request, Response } from 'express';
import { getRandomString, maskCipherToken } from './utils.ts';
import ContactForm from './forms.ts';

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
  const responseData = {};
  let status = 200;
  const form = new ContactForm(data);
  if (!form.isValid()) {
    responseData.errors = form.errors;
    status = 400;
  }
  res.status(status).json(responseData);
});

export default app;
