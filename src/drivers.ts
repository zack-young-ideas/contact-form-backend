/*
Defines drivers for sending emails.

There are two functions defined in this file:
 - sendAWSEmail sends emails using AWS SES
 - sendLocalEmail saves emails to the local filesystem
*/

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

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

const sendAWSEmail = async () => {
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

const sendLocalEmail = async () => {
  /*
  Stores emails as files on the local filesystem.
  */
  return;
}

const sendEmail = async () => {
  if (process.env.EMAIL_DRIVER === 'aws') {
    sendAWSEmail();
  } else {
    sendLocalEmail();
  }
}

export default sendEmail;
