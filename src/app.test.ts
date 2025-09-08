import request from 'supertest';

import app from './app';

describe('/csrf', () => {
  it('should return CSRF token', async () => {
    const response = await request(app).get('/csrf');

    expect(response.statusCode).toBe(200);

    const headers = response.headers;

    expect(headers['x-csrf-token']).toMatch(/^.{32}$/);
  });
});
