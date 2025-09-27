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
      await sendAcknowledgementEmail({
        recipient: form.cleanedData.email,
        template: 'acknowledgement',
        variables: {
          firstName: form.cleanedData.firstName,
        },
      });
      if (process.env.EMAIL_ADMIN_ADDRESS !== undefined) {
        await sendAdminEmail({
          recipient: process.env.EMAIL_ADMIN_ADDRESS,
          template: 'admin',
          variables: form.cleanedData,
        });
      }
    } catch (err: unknown) {
      status = 500;
      if (err instanceof Error) {
        responseData.errors = [err.message];
      } else {
        responseData.errors = ['Unknown error'];
      }
    }
  }
  res.status(status).json(responseData);
}

export { getHandler, postHandler }
