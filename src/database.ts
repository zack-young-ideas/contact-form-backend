import mysql, { ConnectionOptions } from 'mysql2';
import ContactForm from './forms';

const validateConnParams = () => {
  /*
  Ensures that the required connection parameters are available as
  environment variables.
  */
  const requiredConnectionParams: {[index: string]:string | undefined} = {
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_HOST: process.env.DATABASE_HOST,
  };
  for (const key in requiredConnectionParams) {
    if (requiredConnectionParams[key] === undefined) {
      throw Error(
        `Environment variable '${key}' is undefined`
      );
    }
  };
}

const getConnection = async () => {
  /*
  Connects to the MySQL database.
  */
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
  const connection = await mysql.createConnection(connectionObject);
  return connection;
}

const database = {

  createContact: (formObject: ContactForm) => {
    return;
  },

  migrate: async () => {
    /*
    Creates the table needed to store each user's contact info.
    */
    try {
      const conn = await getConnection();
      await conn.execute(
        `CREATE TABLE IF NOT EXISTS contact_form_submissions (
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(128) NOT NULL,
last_name VARCHAR(128) NOT NULL,
email VARCHAR(255) NOT NULL,
phone VARCHAR(20),
message TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  }
};

export { getConnection, validateConnParams };
export default database;
