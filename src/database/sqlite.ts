import Database from 'better-sqlite3';
import ContactForm from '../forms';

const getConnection = () => {
  /*
  Creates or opens the database file.
  */
  let sqliteFile: string = '.contactForm.db';
  if (process.env.DATABASE_SQLITE_FILE !== undefined) {
    sqliteFile = process.env.DATABASE_SQLITE_FILE;
  }
  const db = new Database(sqliteFile);
  return db;
}

const sqliteDriver = {
  createContact: (formObject: ContactForm) => {
    try {
      const db = getConnection();
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
      const statement = db.prepare(insertString);
      statement.run(...values);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  },

  migrate: () => {
    try {
      const db = getConnection();
      db.exec(
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
        console.error('An unkown error occurred');
      }
    }
  }
}

export default sqliteDriver;
