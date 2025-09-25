/*
Defines utility functions.
*/

import crypto from 'node:crypto';
import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

let ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
ALPHABET += '0123456789';


const getRandomString = (string_length: number = 32) => {
  /*
  Generates a random string of characters.
  */
  let output: string = '';
  let index: number = 0;
  while (index < string_length) {
    output += ALPHABET[crypto.randomInt(ALPHABET.length)];
    index++;
  }
  return output;
}

const maskCipherToken = (secret: string) => {
  /*
  Given a secret, generates a token using a mask.
  */

  const mask: string = getRandomString();
  const pairs: number[][] = [];

  for (let index = 0; index < secret.length; index++) {
    const secretItem: string | undefined = secret[index];
    const maskItem: string | undefined = mask[index];
    if ((secretItem !== undefined) && (maskItem !== undefined)) {
      const secretIndex: number = ALPHABET.indexOf(secretItem);
      const maskIndex: number = ALPHABET.indexOf(maskItem);
      pairs.push([secretIndex, maskIndex]);
    }
  }

  const sums = [];
  for (let index = 0; index < pairs.length; index++) {
    const pair: Array<number> | undefined = pairs[index];
    if (pair !== undefined) {
      const firstItem: number | undefined = pair[0];
      const secondItem: number | undefined = pair[1];
      if ((firstItem !== undefined) && (secondItem !== undefined)) {
        sums.push(ALPHABET[(firstItem + secondItem) % ALPHABET.length]);
      }
    }
  }
  const cipher = sums.join('');
  return mask + cipher;
}

const unmaskCipherToken = (inputToken: string) => {
  /*
  Given a token, determines the secret by removing the mask.
  */

  const mask: string = inputToken.slice(0, 32);
  const token: string = inputToken.slice(32);

  const pairs: number[][] = [];
  for (let index = 0; index < token.length; index++) {
    const maskItem: string | undefined = mask[index];
    const tokenItem: string | undefined = token[index];
    if ((maskItem !== undefined) && (tokenItem !== undefined)) {
      pairs.push(
        [ALPHABET.indexOf(tokenItem), ALPHABET.indexOf(maskItem)]
      );
    }
  }

  const secretArray: Array<string> = [];
  pairs.forEach((item) => {
    const firstItem: number | undefined = item[0];
    const secondItem: number | undefined = item[1];
    if ((firstItem !== undefined) && (secondItem !== undefined)) {
      let difference: number = firstItem - secondItem;
      if (difference < 0) {
        difference = ALPHABET.length + difference;
      }
      const letter: string | undefined = ALPHABET[difference];
      if (letter !== undefined) {
        secretArray.push(letter);
      }
    }
  });

  return secretArray.join('');
}

interface UnknownVariables {
  [key: string]: string;
}

const renderTemplate = async (
  templatePath: string,
  templateVariables: UnknownVariables
) => {
  /*
  Renders a template with the given template variables.
  */
  let output: string = '';
  await fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
      throw Error(`File ${templatePath} doesn't exist`);
    } else {
      output = data;
      for (const key in templateVariables) {
        output = output.split(`{{ ${key} }}`).join(templateVariables[key]);
      }
    }
  });
  return output;
}

const getEnvironment = (argument) => {
  /*
  Retrieves environment variables.

  If an environment file is specified as a command-line argument,
  the environment variables from that file are used.

  If no file is specified, the function will search for a default
  .env file in the current working directory.

  If no such file exist, then no file is used. Either way, the
  validateEnvironment() function is called to ensure the required
  environment variables are set.
  */
  let envPath: string;
  if (argument !== undefined) {
    if (!argument.startsWith('--env=')) {
      throw Error(`Unknown command-line argument: ${argument}`);
    } else {
      envPath = argument.slice(6);
      if (!fs.existsSync(envPath)) {
        throw Error(`File ${envPath} does not exist`);
      }
    }
  } else {
    let defaultPath: string = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(defaultPath)) {
      envPath = defaultPath;
    }
  }
  if (envPath) {
    dotenv.config({ path: envPath });
  }
  validateEnvironment();
}

const validateEnvironment = () => {
  /*
  Ensures that the required environment variables are defined.
  Throws an error if any are missing.
  */
  const requiredVariables: {[index: string]:string | undefined} = {
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_HOST: process.env.DATABASE_HOST,
    EMAIL_DRIVER: process.env.EMAIL_DRIVER,
    EMAIL_ADMIN_ADDRESS: process.env.EMAIL_ADMIN_ADDRESS,
  };
  // Ensure required variables are defined.
  for (const key in requiredVariables) {
    if (requiredVariables[key] === undefined) {
      throw Error(
        `Environment variable '${key}' is undefined`
      )
    }
  }
  // Ensure the proper email-related variables are defined.
  const emailVariables: {[index: string]:string | undefined} = {};
  if (requiredVariables.EMAIL_DRIVER === 'local') {
    emailVariables.EMAIL_FILEPATH = process.env.EMAIL_FILEPATH;
  }
  if (requiredVariables.EMAIL_DRIVER === 'aws') {
    // Define variables required to use AWS SES.
  }
  for (const key in emailVariables) {
    if (emailVariables[key] === undefined) {
      throw Error(
        `Environment variable '${key}' is undefined`
      )
    }
  }
}

export {
  getEnvironment,
  getRandomString,
  maskCipherToken,
  renderTemplate,
  unmaskCipherToken,
  validateEnvironment,
};
