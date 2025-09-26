import { postHandler } from './routes';
import database from '../database';
import { sendAcknowledgementEmail, sendAdminEmail } from '../mail';
// eslint-disable-next-line
import ContactForm from '../forms';

jest.mock('../database');
jest.mock('../forms');
jest.mock('../mail');

// Mock values used by the tests below.
let request;
let response;
let formObject;
let postData;

beforeEach(() => {
  // Defines mock values used by request handler function.
  postData = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'jsmith@example.com',
    phone: '+12345678901',
    message: 'Hello',
  }
  request = { body: postData };
  response = { status: () => ({ json: () => null }) };
  formObject = {
    isValid: () => true,
    cleanedData: postData,
  };
  ContactForm = jest.fn(() => formObject);
});

afterEach(() => jest.resetAllMocks());

describe('postHandler', () => {
  it('should create database entry', async () => {
    expect(database.createContact).toHaveBeenCalledTimes(0);
    
    await postHandler(request, response);

    expect(database.createContact).toHaveBeenCalledTimes(1);
    expect(database.createContact).toHaveBeenCalledWith(formObject);
  });

  it('should send confirmation email', async () => {
    expect(sendAcknowledgementEmail).toHaveBeenCalledTimes(0);
    
    await postHandler(request, response);

    expect(sendAcknowledgementEmail).toHaveBeenCalledTimes(1);
    expect(sendAcknowledgementEmail).toHaveBeenCalledWith(
      'jsmith@example.com'
    );
  });

  it('should send email to admin', async () => {
    expect(sendAdminEmail).toHaveBeenCalledTimes(0);
    
    await postHandler(request, response);

    expect(sendAdminEmail).toHaveBeenCalledTimes(1);
    expect(sendAdminEmail).toHaveBeenCalledWith(postData);
  });
});
