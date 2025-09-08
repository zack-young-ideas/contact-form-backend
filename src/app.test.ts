import request from 'supertest';

import app from './app';

describe('/csrf', () => {
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
