import { postHandler } from './routes';
import database from '../database';
import { sendAcknowledgementEmail, sendAdminEmail } from '../mail';
// eslint-disable-next-line
import ContactForm from '../forms';

jest.mock('../database');
jest.mock('../forms');
jest.mock('../mail');

// Mock values used by the tests below.
let jsonFunction;
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
  jsonFunction = jest.fn();
  response = {
    status: jest.fn(() => ({
      json: jsonFunction,
    })),
  };
  formObject = {
    isValid: () => true,
    cleanedData: postData,
  };
  ContactForm = jest.fn(() => formObject);
  process.env.EMAIL_ADMIN_ADDRESS = 'admin@example.com';
});

afterEach(() => jest.resetAllMocks());

describe('postHandler', () => {
  it('should set status to 200 if form is valid', async () => {
    expect(response.status).toHaveBeenCalledTimes(0);
    expect(jsonFunction).toHaveBeenCalledTimes(0);

    await postHandler(request, response);

    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(jsonFunction).toHaveBeenCalledTimes(1);
    expect(jsonFunction).toHaveBeenCalledWith({});
  });

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
    expect(sendAcknowledgementEmail).toHaveBeenCalledWith({
      recipient: postData.email,
      template: 'acknowledgement',
      variables: {
        firstName: postData.firstName,
      },
    });
  });

  it('should send email to admin', async () => {
    expect(sendAdminEmail).toHaveBeenCalledTimes(0);
    
     await postHandler(request, response);
 
    expect(sendAdminEmail).toHaveBeenCalledTimes(1);
    expect(sendAdminEmail).toHaveBeenCalledWith({
      recipient: 'admin@example.com',
      template: 'admin',
      variables: postData
    });
  });

  it('should send error if form is invalid', async () => {
    ContactForm = jest.fn(() => ({
      isValid: () => false,
      errors: ['Invalid value'],
    }));

    expect(response.status).toHaveBeenCalledTimes(0);
    expect(jsonFunction).toHaveBeenCalledTimes(0);

    await postHandler(request, response);

    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(jsonFunction).toHaveBeenCalledTimes(1);
    expect(jsonFunction).toHaveBeenCalledWith({
      errors: ['Invalid value' ]
    });
  });
});
