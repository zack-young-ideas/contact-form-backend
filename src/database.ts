import mysql, { ConnectionOptions } from 'mysql2';
import ContactForm from './forms';

const getConnection = async (connectionOptions: ConnectionOptions) => {
  const connection = await mysql.createConnection(connectionOptions);
  return connection;
}

const database = {

  createContact: (formObject: ContactForm) => {
    return;
  },

  migrate: async (connectionOptions: ConnectionOptions) => {
    try {
      const conn = await getConnection(connectionOptions);
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

export default database;
