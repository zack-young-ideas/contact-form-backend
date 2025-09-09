import { Request, Response } from 'express';

import database from './database.ts';
import { getRandomString, maskCipherToken } from './utils.ts';
import ContactForm from './forms.ts';

const getHandler = async (req: Request, res: Response) => {
  const csrfSecret = getRandomString();
  res.cookie('csrftoken', csrfSecret);
  res.set('X-CSRF-Token', maskCipherToken(csrfSecret));
  res.json({});
}

const postHandler = async (req: Request, res: Response) => {
  const data = req.body;
  const responseData = {};
  let status = 200;
  const form = new ContactForm(data);
  if (!form.isValid()) {
    responseData.errors = form.errors;
    status = 400;
  } else {
    try {
      await database.createContact(form);
    } catch {
      status = 400;
      responseData.errors = ['Unable to connect to database'];
    }
  }
  res.status(status).json(responseData);
}

export { getHandler, postHandler }
