import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql2';
import database from '../src/database';

// Retrieve the .env file.
let envPath: string;
const argument: string | undefined = process.argv[2];
if (argument !== undefined) {
  if (!argument.startsWith('--env=')) {
    throw Error(`Unknown command line argument: ${argument}`);
  } else {
    const envFile: string = argument.slice(6);
    envPath = path.resolve(process.cwd(), envFile);
    if (!fs.existsSync(envPath)) {
      throw Error(`File ${envPath} does not exist`);
    }
  }
} else {
  envPath = path.resolve(process.cwd(), '.env');
}
dotenv.config({ path: envPath });

// Validate database connection info from .env file.
const requiredConnectionParams: {[index: string]:string | undefined} = {
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_HOST: process.env.DATABASE_HOST,
};
for (const key in requiredConnectionParams) {
  if (requiredConnectionParams[key] === undefined) {
    throw Error(
      `.env file is missing '${key}' value; this value is required`
    );
  }
};

// Perform database migrations.
const connectionObject: ConnectionOptions = {
  user: String(process.env.DATABASE_USER),
  password: String(process.env.DATABASE_PASSWORD),
  database: String(process.env.DATABASE_NAME),
  host: String(process.env.DATABASE_HOST),
};
if (process.env.DATABASE_CHARSET !== undefined) {
  connectionObject.charset = process.env.DATABASE_CHARSET;
}
if (process.env.DATABASE_PORT !== undefined) {
  connectionObject.port = Number(process.env.DATABASE_PORT);
}
if (process.env.DATABASE_LOCALADDRESS !== undefined) {
  connectionObject.localAddress = process.env.DATABASE_LOCALADDRESS;
}
if (process.env.DATABASE_TIMEZONE !== undefined) {
  connectionObject.timezone = process.env.DATABASE_TIMEZONE;
}
database.migrate(connectionObject);
