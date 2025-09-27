import request from 'supertest';

import app from './app';
// eslint-disable-next-line
import database from './database';
// eslint-disable-next-line
import { sendAcknowledgementEmail, sendAdminEmail } from '../mail';

jest.mock('./database');
jest.mock('./mail');

describe('/csrf GET', () => {
  it('should return 200 OK response', async () => {
    const response = await request(app).get('/csrf');

    expect(response.statusCode).toBe(200);
  });

  it('response should contain CSRF token in custom header', async () => {
    const response = await request(app).get('/csrf');
    const headers = response.headers;

    expect(headers['x-csrf-token']).toMatch(/^[a-zA-Z0-9]{64}$/);
  });

  it('response should set cookie containing secret', async () => {
    const response = await request(app).get('/csrf');
    const setCookieHeader = response.headers['set-cookie'];

    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/^csrftoken=[a-zA-Z0-9]{32}; Path=\//);
  });
});

describe('/contact POST', () => {
  it('should return 200 OK response', async () => {
    const response = await request(app).post('/contact').send({
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@example.com',
      phone: '+12345678901',
      message: 'Hello',
    });

    expect(response.statusCode).toBe(200);
  });

  it('requires firstName, lastName, and email', async () => {
    const response = await request(app).post('/contact').send({
      firstName: '',
      lastName: '',
      email: '',
      phone: '+12345678901',
      message: 'Hello',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors', [
      'Invalid first name',
      'Invalid last name',
      'Invalid email address',
    ]);
  });
});

describe('default 404 response', () => {
  it('should be returned when unknown resource is requested', async () => {
    const response = await request(app).get('/unknown');

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Not found');
  });
});
