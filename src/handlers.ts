import { Request, Response } from 'express';

import database from './database.ts';
import mail from './mail.ts';
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
