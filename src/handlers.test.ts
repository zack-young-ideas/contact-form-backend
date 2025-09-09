import { postHandler } from './handlers.ts';
import database from './database.ts';
import ContactForm from './forms.ts';

jest.mock('./database.ts');
jest.mock('./forms.ts');

describe('postHandler', () => {
  it('should create database entry', async () => {
    const request = {};
    const response = { status: () => ({ json: () => null }) };
    const formObject = { isValid: () => true };
    ContactForm = jest.fn(() => formObject);

    expect(database.createContact).toHaveBeenCalledTimes(0);
    
    await postHandler(request, response);

    expect(database.createContact).toHaveBeenCalledTimes(1);
    expect(database.createContact).toHaveBeenCalledWith(formObject);
  });
});
