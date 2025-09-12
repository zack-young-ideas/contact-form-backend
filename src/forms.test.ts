import validator from 'validator';
import xss from 'xss';
import ContactForm from './forms.ts';

jest.mock('validator');
jest.mock('xss', () => jest.fn());

beforeEach(() => {
  jest.clearAllMocks();

  validator.isAlpha = jest.fn((input) => true);
  validator.isEmail = jest.fn((input) => true);
  validator.isMobilePhone = jest.fn((input) => true);

  xss = xss.mockImplementation((input) => input);
});

describe('ContactForm', () => {
  describe('isValid method', () => {
    it('should return true if data is valid', () => {
      const form = new ContactForm({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });

      expect(form.isValid()).toBe(true);
    });

    it('should return false if data is missing', () => {
      const form = new ContactForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+12345678901',
        message: 'Hello',
      });

      expect(form.isValid()).toBe(false);
    });

    it('should use validator', () => {
      expect(validator.isAlpha).toHaveBeenCalledTimes(0);
      expect(validator.isEmail).toHaveBeenCalledTimes(0);

      const form = new ContactForm({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });
      form.isValid();

      expect(validator.isAlpha).toHaveBeenCalledTimes(2);
      expect(validator.isAlpha.mock.calls).toEqual([
        ['John'],
        ['Smith'],
      ]);

      expect(validator.isEmail).toHaveBeenCalledTimes(1);
      expect(validator.isEmail).toHaveBeenCalledWith('jsmith@example.com');

      expect(validator.isMobilePhone).toHaveBeenCalledTimes(1);
      expect(validator.isMobilePhone).toHaveBeenCalledWith('+12345678901');
    });

    it('should provide errors for invalid input values', () => {
      validator.isMobilePhone = jest.fn(() => false);

      let form = new ContactForm({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });
      form.isValid();

      expect(form.errors.length).toBe(1);
      expect(form.errors[0]).toBe('Invalid phone number');

      validator.isEmail = jest.fn(() => false);

      form = new ContactForm({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });
      form.isValid();

      expect(form.errors.length).toBe(2);
      expect(form.errors[0]).toBe('Invalid email address');
      expect(form.errors[1]).toBe('Invalid phone number');
    });
  });

  describe('cleanedData', () => {
    it('contains sanitized data', () => {
      let form = new ContactForm({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });
      form.isValid();

      expect(form.cleanedData).toMatchObject({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });
    });

    it('throws error if isValid() method is not called first', () => {
      let form = new ContactForm({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });

      expect(() => form.cleanedData).toThrow('Data unavailable');
    });

    it('calls xss on each input', () => {
      expect(xss).toHaveBeenCalledTimes(0);

      let form = new ContactForm({
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phone: '+12345678901',
        message: 'Hello',
      });
      form.isValid();
      form.cleanedData;

      expect(xss).toHaveBeenCalledTimes(5);
      expect(xss.mock.calls[0][0]).toMatch('John');
      expect(xss.mock.calls[1][0]).toMatch('Smith');
      expect(xss.mock.calls[2][0]).toMatch('jsmith@example.com');
      expect(xss.mock.calls[3][0]).toMatch('+12345678901');
      expect(xss.mock.calls[4][0]).toMatch('Hello');
    });
  });
});
