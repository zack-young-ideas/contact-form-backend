import { Request, Response } from 'express';

import database from '../database';
import mail from '../mail';
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
      await mail.sendMail({
        template: 'contactForm.html',
        variables: {
          title: 'Thank You!',
          content: ('Thank you for reaching out to us. '
                    + 'A member of our team will contact you shortly.'),
        },
      });
      await mail.contactAdmin({ content: '' });
    } catch {
      status = 500;
      responseData.errors = ['Unable to connect to database'];
    }
  }
  res.status(status).json(responseData);
}

export { getHandler, postHandler }
