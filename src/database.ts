import mysql, { ConnectionOptions } from 'mysql2';
import ContactForm from './forms';

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

  createContact: async (formObject: ContactForm) => {
    try {
      const conn = await getConnection();
      let variables = 'first_name, last_name, email'
      let params = '?, ?, ?';
      const values = [
        formObject.firstName, 
        formObject.lastName, 
        formObject.email
      ];
      if (formObject.phone !== undefined) {
        variables += ', phone';
        params += ', ?';
        values.push(formObject.phone);
      }
      if (formObject.message !== undefined) {
        variables += ', message';
        params += ', ?';
        values.push(formObject.message);
      }
      const insertString = 'INSERT INTO contact_form_submissions '
                         + `(${variables}) VALUES (${params});`;
      await conn.execute(insertString, values);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
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

export { getConnection };
export default database;
