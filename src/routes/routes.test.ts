import { postHandler } from './routes';
import database from '../database';
import mail from '../mail';
// eslint-disable-next-line
import ContactForm from '../forms';

jest.mock('../database');
jest.mock('../forms');
jest.mock('../mail');

afterEach(() => jest.resetAllMocks());

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

  it('should send confirmation email', async () => {
    const request = {};
    const response = { status: () => ({ json: () => null }) };
    const formObject = { isValid: () => true };
    ContactForm = jest.fn(() => formObject);

    expect(mail.sendMail).toHaveBeenCalledTimes(0);
    
    await postHandler(request, response);

    expect(mail.sendMail).toHaveBeenCalledTimes(1);
    expect(mail.sendMail).toHaveBeenCalledWith({
      template: 'contactForm.html',
      variables: {
        title: 'Thank You!',
        content: ('Thank you for reaching out to us. A member of '
                  + 'our team will contact you shortly.'),
      }
    });
  });

  it('should send email to admin', async () => {
    const request = {
      body: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      }
    };
    const response = { status: () => ({ json: () => null }) };
    const formObject = { isValid: () => true };
    ContactForm = jest.fn(() => formObject);

    expect(mail.contactAdmin).toHaveBeenCalledTimes(0);
    
    await postHandler(request, response);

    expect(mail.contactAdmin).toHaveBeenCalledTimes(1);
    expect(mail.contactAdmin).toHaveBeenCalledWith({
      content: ''
    });
  });
});
