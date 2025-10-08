/*
Defines middleware that validates each POST request's CSRF token.
*/

import { Request, Response, NextFunction } from 'express';
import { unmaskCipherToken } from '../utils';

const validateCsrf = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/contact') {
    const csrfSecret = req.cookies.csrftoken;
    const csrfToken = req.get('X-CSRF-Token');
    if (csrfToken !== undefined) {
      const output = unmaskCipherToken(csrfToken);
      if (output === csrfSecret) {
        return next();
      }
    }
    return res.status(400).json({ message: 'Invalid CSRF secret' });
  }
  return next();
}

export default validateCsrf;
