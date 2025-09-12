import validator from 'validator';
import ContactForm from './forms.ts';

jest.mock('validator');

beforeEach(() => {
  validator.isAlpha = jest.fn((input) => true);
  validator.isEmail = jest.fn((input) => true);
  validator.isMobilePhone = jest.fn((input) => true);
});
afterEach(() => jest.resetAllMocks());

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
});
