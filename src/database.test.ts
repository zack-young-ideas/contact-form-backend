import { getConnection, validateConnParams } from './database';
import mysql from 'mysql2';

jest.mock('mysql2', () => ({
  createConnection: jest.fn(),
}));

beforeEach(() => {
  process.env.DATABASE_USER = 'user';
  process.env.DATABASE_PASSWORD = 'supersecret';
  process.env.DATABASE_NAME = 'database';
  process.env.DATABASE_HOST = 'localhost';
});

describe('validateConnParams', () => {
  it('should throw error if required parameters are missing', () => {
    expect(() => validateConnParams()).not.toThrow();

    delete process.env.DATABASE_USER;

    expect(() => validateConnParams()).toThrow(
      "Environment variable 'DATABASE_USER' is undefined"
    );

    process.env.DATABASE_USER = 'user';
    delete process.env.DATABASE_HOST;

    expect(() => validateConnParams()).toThrow(
      "Environment variable 'DATABASE_HOST' is undefined"
    );

    process.env.DATABASE_HOST = 'localhost';
    delete process.env.DATABASE_PASSWORD;

    expect(() => validateConnParams()).toThrow(
      "Environment variable 'DATABASE_PASSWORD' is undefined"
    );
  });
});

describe('getConnection', () => {
  it('should call mysql.createConnection method', async () => {
    process.env.DATABASE_CHARSET = 'utf8mb4';
    process.env.DATABASE_PORT = '3306';

    expect(mysql.createConnection).toHaveBeenCalledTimes(0);

    await getConnection();

    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mysql.createConnection).toHaveBeenCalledWith({
      user: 'user',
      password: 'supersecret',
      database: 'database',
      host: 'localhost',
      charset: 'utf8mb4',
      port: 3306,
    });
  });
});
