/*
Creates records in the database each time a user submits contact info.
*/

import mysqlDriver from './mysql';
import sqliteDriver from './sqlite';
import ContactForm from '../forms';

const database = {
  createContact: async (formObject: ContactForm) => {
    if (process.env.DATABASE_DRIVER === 'mysql') {
      await mysqlDriver.createContact(formObject);
    } else {
      sqliteDriver.createContact(formObject);
    }
  },

  migrate: async () => {
    if (process.env.DATABASE_DRIVER === 'mysql') {
      await mysqlDriver.migrate();
    } else {
      sqliteDriver.migrate();
    }
  }
}

export default database;
