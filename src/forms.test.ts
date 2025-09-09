import ContactForm from './forms.ts';

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
  });
});
