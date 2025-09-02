import request from 'supertest';

import app from './app';

describe('/contact', () => {
  it('should return text', async () => {
    const response = await request(app).get('/contact');

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ message: 'Cool' });
  });
});
