import validateCsrf from './csrf';
import { getRandomString, maskCipherToken } from '../utils';

describe('validateCsrf', () => {
  it('calls next if CSRF secret is valid', () => {
    const csrfSecret = getRandomString();
    next = jest.fn();
    req = {
      cookies: { csrftoken: csrfSecret },
      get: () => maskCipherToken(csrfSecret),
      path: '/contact',
    };
    res = {};

    expect(next).toHaveBeenCalledTimes(0);

    validateCsrf(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('calls next if CSRF secret is valid', () => {
    next = jest.fn();
    req = {
      cookies: { csrftoken: 'random' },
      get: () => 'someOtherRandomValue',
      path: '/contact',
    };
    res = {
      status: jest.fn(() => ({
        json: jest.fn(),
      })),
    };

    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledTimes(0);

    validateCsrf(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
