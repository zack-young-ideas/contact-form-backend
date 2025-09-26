import { Request, Response } from 'express';

import database from '../database';
import { sendAcknowledgementEmail, sendAdminEmail } from '../mail';
import { getRandomString, maskCipherToken } from '../utils';
import ContactForm from '../forms';

const getHandler = async (req: Request, res: Response) => {
  const csrfSecret = getRandomString();
  res.cookie('csrftoken', csrfSecret);
  res.set('X-CSRF-Token', maskCipherToken(csrfSecret));
  res.json({});
}

interface ResponseData {
  errors?: Array<string>;
}

const postHandler = async (req: Request, res: Response) => {
  const data = req.body;
  const responseData: ResponseData = {};
  let status: number = 200;
  const form: ContactForm = new ContactForm(data);
  if (!form.isValid()) {
    responseData.errors = form.errors;
    status = 400;
  } else {
    try {
      await database.createContact(form);
      await sendAcknowledgementEmail(form.cleanedData.email);
      await sendAdminEmail(form.cleanedData);
    } catch (err) {
      status = 500;
      responseData.errors = [err.message];
    }
  }
  res.status(status).json(responseData);
}

export { getHandler, postHandler }
