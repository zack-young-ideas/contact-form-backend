/*
Defines utility functions.
*/

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const getEnvironment = (argument: string | undefined) => {
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
  let envPath: string = '';
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
    const defaultPath: string = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(defaultPath)) {
      envPath = defaultPath;
    }
  }
  if (envPath !== '') {
    dotenv.config({ path: envPath });
  }
  validateEnvironment('serve');
}

const validateEnvironment = (command: string = 'build') => {
  /*
  Ensures that the required environment variables are defined.
  Throws an error if any are missing.
  */
  const requiredVariables: {[index: string]:string | undefined} = {
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_HOST: process.env.DATABASE_HOST,
  };
  if (command === 'serve') {
    // If the command is 'serve', ensure the proper email-related
    // variables are defined.
    requiredVariables.EMAIL_DRIVER = process.env.EMAIL_DRIVER;
    requiredVariables.EMAIL_TEMPLATE_DIR = process.env.EMAIL_TEMPLATE_DIR;
    requiredVariables.EMAIL_ADMIN_ADDRESS = process.env.EMAIL_ADMIN_ADDRESS;
    const emailVariables: {[index: string]:string | undefined} = {};
    if (requiredVariables.EMAIL_DRIVER === 'local') {
      emailVariables.EMAIL_FILEPATH = process.env.EMAIL_FILEPATH;
    }
    for (const key in emailVariables) {
      if (emailVariables[key] === undefined) {
        throw Error(
          `Environment variable '${key}' is undefined`
        )
      }
    }

    // Ensure EMAIL_DRIVER is assigned to either 'local' or 'aws'.
    const driver: string | undefined = requiredVariables.EMAIL_DRIVER;
    if (typeof driver === 'string' && ['aws', 'local'].indexOf(driver) < 0) {
      const errorMessage = "Environment variable 'EMAIL_DRIVER' must be "
                         + "assigned to either 'aws' or 'local'; "
                         + `${requiredVariables.EMAIL_DRIVER} is not an `
                         + 'allowed option'
      throw Error(errorMessage);
    }
  }

  // Ensure all required variables are defined.
  for (const key in requiredVariables) {
    if (requiredVariables[key] === undefined) {
      throw Error(
        `Environment variable '${key}' is undefined`
      )
    }
  }
}

export { getEnvironment, validateEnvironment };
