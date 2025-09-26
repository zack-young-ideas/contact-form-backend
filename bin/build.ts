import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getEnvironment } from '../src/utils';
import database from '../src/database';

// Retrieve the .env file.
let envPath: string;
const argument: string | undefined = process.argv[2];
getEnvironment(argument);

// Perform database migrations.
database.migrate();
