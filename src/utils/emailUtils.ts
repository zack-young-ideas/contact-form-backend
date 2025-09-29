/*
Defines a utility function used to render email templates.
*/

import fs from 'fs';

interface UnknownVariables {
  [key: string]: string;
}

const renderTemplate = async (
  templatePath: string,
  templateVariables: UnknownVariables
) => {
  /*
  Renders an email template with the given template variables.
  */
  let output: string = '';
  try {
    output = fs.readFileSync(templatePath, 'utf8');
  } catch {
    throw Error(`File ${templatePath} doesn't exist`);
  }
  for (const key in templateVariables) {
    output = output.split(`{{ ${key} }}`).join(templateVariables[key]);
  }
  return output;
}

const getRandomInt = (digits: number) => {
  /*
  Generates a random integer with the specified number of digits.

  For instance, if digits=4, a random integer such as 3725 will be
  returned.
  */
  return Math.floor(Math.random() * (10 ** digits));
};

const formatDate = (date: Date) => {
  /*
  Givevn a Date object, returns a string displaying the date in RFC 5322
  format.

  The strings returned by this function are set as the values of the
  Date header in emails.
  */
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const tzOffset = -date.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const tzHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, "0");
  const tzMins = String(Math.abs(tzOffset) % 60).padStart(2, "0");

  const tzString = `${sign}${tzHours}${tzMins}`;

  let output = `${dayName}, ${day} ${month} ${year} `
  output += `${hours}:${minutes}:${seconds} ${tzString}`;
  return output
};

const renderEmail = (
  recipient: string, 
  from: string, 
  subject: string,
  htmlContent: string,
  textContent: string,
) => {
  /*
  Generates a MIME email message given the contents of the email.
  */
  let boundaryLine = `----=_Part_${getRandomInt(6)}_${getRandomInt(9)}`;
  boundaryLine += `.${getRandomInt(13)}`;
  const date = new Date();
  const messageId = `<${getRandomInt(8)}.${getRandomInt(6)}.${from}>`;
  const output = `From: ${from}
To: ${recipient}
Subject: ${subject}
Date: ${formatDate(date)}
Message-ID: ${messageId}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="${boundaryLine}"

--${boundaryLine}
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: 7bit

${textContent}

--${boundaryLine}
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

${htmlContent}

--${boundaryLine}--
`;
  return output;
}

export { formatDate, getRandomInt, renderEmail, renderTemplate };
