import path from 'path';
import sendEmail from './drivers';
import { MailObject } from './types';
import { renderTemplate } from '../utils';

const sendAcknowledgementEmail = async (mailObject: MailObject) => {
  let templateDir: string = '';
  if (process.env.EMAIL_TEMPLATE_DIR !== undefined) {
    templateDir = process.env.EMAIL_TEMPLATE_DIR;
  }

  // First, retrieve the HTML template and populate it with the
  // values assigned to each template variable.
  const htmlTemplatePath = path.resolve(
    templateDir,
    `${mailObject.template}.html`
  );
  const htmlContent = await renderTemplate(
    htmlTemplatePath,
    mailObject.variables
  );

  // Then, retrieve the text template and populate it with the
  // values assigned to each template variable.
  const textTemplatePath = path.resolve(
    templateDir,
    `${mailObject.template}.txt`
  );
  const textContent = await renderTemplate(
    textTemplatePath,
    mailObject.variables
  );

  await sendEmail(mailObject.recipient, htmlContent, textContent);
},

const sendAdminEmail = async (mailObject: MailObject) => {
  let templateDir: string = '';
  if (process.env.EMAIL_TEMPLATE_DIR !== undefined) {
    templateDir = process.env.EMAIL_TEMPLATE_DIR;
  }

  // First, retrieve the HTML template and populate it with the
  // values assigned to each template variable.
  const htmlTemplatePath = path.resolve(
    templateDir,
    `${mailObject.template}.html`
  );
  const htmlContent = await renderTemplate(
    htmlTemplatePath,
    mailObject.variables
  );

  // Then, retrieve the text template and populate it with the
  // values assigned to each template variable.
  const textTemplatePath = path.resolve(
    templateDir,
    `${mailObject.template}.txt`
  );
  const textContent = await renderTemplate(
    textTemplatePath,
    mailObject.variables
  );

  await sendEmail(mailObject.recipient, htmlContent, textContent);
},

export { sendAcknowledgementEmail, sendAdminEmail };
