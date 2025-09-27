/*
Defines drivers for sending emails.

There are two functions defined in this file:
 - sendAWSEmail sends emails using AWS SES
 - sendLocalEmail saves emails to the local filesystem
*/

import fs from 'fs';
import path from 'path';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getRandomString } from '../utils';

const sesClient = new SESClient({ region: 'us-east-1' });

const createSendEmailCommand = (toAddress: string, fromAddress: string) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: 'HTML_FORMAT_BODY',
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'EMAIL_SUBJECT',
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
}

const sendAWSEmail = async (
  recipient: string,
  htmlContent: string,
  textContent: string = '',
) => {
  /*
  Sends emails using AWS Simple Email Service.
  */
  const sendEmailCommand = createSendEmailCommand(
    'recipient@example.com',
    'sender@example.com'
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (err) {
    console.error(err);
  }
}

const sendLocalEmail = async (
  recipient: string,
  htmlContent: string,
  textContent: string = '',
) => {
  /*
  Stores emails as files on the local filesystem.
  */
  await fs.mkdir(process.env.EMAIL_FILEPATH, { recursive: true }, (err) => {
    if (err) {
      throw Error('Error creating directory:', err);
    }
  });
  const timestamp = Date.now().toString(36);
  const randomString = getRandomString();
  const filename = path.resolve(
    process.env.EMAIL_FILEPATH, 
    timestamp + randomString
  );
//  await fs.writeFile(filename, 
}

const sendEmail = async (
  recipient: string,
  htmlContent: string,
  textContent: string = '',
) => {
  if (process.env.EMAIL_DRIVER === 'aws') {
    await sendAWSEmail(recipient, htmlContent, textContent);
  } else {
    await sendLocalEmail(recipient, htmlContent, textContent);
  }
}

export default sendEmail;
