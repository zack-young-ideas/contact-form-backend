import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import database from '../src/database';

// Retrieve the .env file.
let envPath: string;
const argument: string | undefined = process.argv[2];
if (argument !== undefined) {
  if (!argument.startsWith('--env=')) {
    throw Error(`Unknown command line argument: ${argument}`);
  } else {
    envPath = argument.slice(6);
    if (!fs.existsSync(envPath)) {
      throw Error(`File ${envPath} does not exist`);
    }
  }
} else {
  envPath = path.resolve(process.cwd(), '.env');
}
dotenv.config({ path: envPath });

// Perform database migrations.
database.migrate();
