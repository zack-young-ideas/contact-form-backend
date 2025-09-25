import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import {
  getEnvironment,
  getRandomString,
  maskCipherToken,
  renderTemplate,
  unmaskCipherToken,
  validateEnvironment,
} from './utils';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));
jest.mock('fs', () => ({
  readFile: (filePath, encoding, callback) => {
    const data = '<!DOCTYPE html>\n'
               + '<body>\n'
               + '  <h1>{{ title }}</h1>\n'
               + '  <p>The quick brown {{ variable1 }} jumps over the '
               + 'lazy {{ variable2 }}</p>\n'
               + '</body>\n';
    callback(null, data);
  },
}));

beforeEach(() => {
  fs.existsSync = (filename) => true;
});
afterEach(() => jest.resetAllMocks());

describe('getRandomString', () => {
  it('should return random string of characters', () => {
    const shortString = getRandomString(12);
    const mediumString = getRandomString(32);
    const longString = getRandomString(182);

    expect(shortString).toMatch(/^.{12}$/);
    expect(mediumString).toMatch(/^.{32}$/);
    expect(longString).toMatch(/^.{182}$/);
  });
});

describe('maskCipherSecret', () => {
  it('should generate token given a secret value', () => {
    const secret = getRandomString();
    const token = maskCipherToken(secret);
    const decryptedValue = unmaskCipherToken(token);

    expect(secret).toBe(decryptedValue);
  });
});

describe('renderTemplate', () => {
  it('should render templates with the given variables', async () => {
    const actualOutput = await renderTemplate(
      'template.html',
      {
        title: 'Welcome To The Site',
        variable1: 'fox',
        variable2: 'dog',
      }
    );
    const expectedOutput = '<!DOCTYPE html>\n'
                         + '<body>\n'
                         + '  <h1>Welcome To The Site</h1>\n'
                         + '  <p>The quick brown fox jumps over the lazy '
                         + 'dog</p>\n'
                         + '</body>\n';

    expect(actualOutput).toBe(expectedOutput);
  });
});

describe('getEnvironment', () => {
  beforeAll(() => {
    /*
    These environment variables must be assigned to values in order
    to avoid having the validateEnvironment() function throw an
    error.
    */
    process.env.DATABASE_USER = 'user';
    process.env.DATABASE_PASSWORD = 'supersecret';
    process.env.DATABASE_NAME = 'database';
    process.env.DATABASE_HOST = 'localhost';
    process.env.EMAIL_DRIVER = 'local';
    process.env.EMAIL_FILEPATH = '/local/file';
    process.env.EMAIL_ADMIN_ADDRESS = 'admin@example.com';
  });

  it('should use .env file specified in command-line argument', () => {
    expect(dotenv.config).toHaveBeenCalledTimes(0);

    getEnvironment('--env=.stuff');

    expect(dotenv.config).toHaveBeenCalledTimes(1);
    expect(dotenv.config).toHaveBeenCalledWith({ path: '.stuff' });
  });

  it('should use default .env file if no argument is specified', () => {
    expect(dotenv.config).toHaveBeenCalledTimes(0);

    getEnvironment();

    expect(dotenv.config).toHaveBeenCalledTimes(1);
    expect(dotenv.config).toHaveBeenCalledWith(
      { path: path.resolve(process.cwd(), '.env') }
    );
  });

  it('should throw error if unknown argument is passed', () => {
    expect(() => getEnvironment('--unknown=.env')).toThrow(
      'Unknown command-line argument: --unknown=.env'
    );
  });

  it("should throw error if file doesn't exist", () => {
    fs.existsSync = (filename) => false;

    expect(() => getEnvironment('--env=.env')).toThrow(
      'File .env does not exist'
    );
  });
});
