/*
Defines drivers for sending emails.

There are two functions defined in this file:
 - sendAWSEmail sends emails using AWS SES
 - sendLocalEmail saves emails to the local filesystem
*/

import fs from 'fs';
import path from 'path';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getRandomString, renderEmail } from '../utils';

const sesClient = new SESClient({ region: 'us-east-1' });

const createSendEmailCommand = (
  toAddress: string,
  fromAddress: string,
  subject: string,
  htmlContent: string,
  textContent: string,
) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlContent,
        },
        Text: {
          Charset: 'UTF-8',
          Data: textContent,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
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
  const fromEmail: string | undefined = process.env.EMAIL_FROM_ADDRESS;
  if (fromEmail !== undefined) {
    const sendEmailCommand = createSendEmailCommand(
      recipient,
      fromEmail,
      'Contact form submission',
      htmlContent,
      textContent
    );
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (err) {
      console.error(err);
    }
  } else {
    throw Error(
      `Environment variable EMAIL_FROM_ADDRESS must be assigned a value`
    );
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
  const filePath: string | undefined = process.env.EMAIL_FILEPATH;
  const fromEmail: string | undefined = process.env.EMAIL_FROM_ADDRESS;
  if ((filePath !== undefined) && (fromEmail !== undefined)) {
    await fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) {
        throw Error(`Error creating directory: ${err.message}`);
      }
    });
    const timestamp = Date.now().toString(36);
    const randomString = getRandomString();
    const filename = path.resolve(filePath, timestamp + randomString);

    // Write the email to the local filesystem.
    const content = renderEmail(
      recipient,
      fromEmail,
      'Contact form submission',
      htmlContent,
      textContent,
    );
    await fs.writeFile(filename, content, (err) => {
      if (err) {
        console.error(`Error writing file: ${err.message}`);
      }
    });
  } else {
    let envVar: string = 'EMAIL_FROM_ADDRESS';
    if (filePath === undefined) {
      envVar = 'EMAIL_FILEPATH';
    }
    throw Error(
      `Environment variable ${envVar} must be assigned a value`
    );
  }
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
