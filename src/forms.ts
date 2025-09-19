import validator from 'validator';
import xss from 'xss';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

class ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  errors: Array<string>;
  validation: boolean;

  constructor(args: FormData) {
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.email = args.email;
    this.phone = args.phone;
    this.message = args.message;
    this.errors = [];
    this.validation = false;
  }

  isValid() {
    let output = false;
    if (!this.firstName || !validator.isAlpha(this.firstName)) {
      this.errors.push('Invalid first name');
    }
    if (!this.lastName || !validator.isAlpha(this.lastName)) {
      this.errors.push('Invalid last name');
    }
    if (!this.email || !validator.isEmail(this.email)) {
      this.errors.push('Invalid email address');
    }
    if (this.phone && !validator.isMobilePhone(this.phone)) {
      this.errors.push('Invalid phone number');
    }
    if (this.errors.length === 0) {
      output = true;
    }
    this.validation = true;
    return output;
  }

  get cleanedData() {
    if (!this.validation) {
      throw new Error('Data unavailable');
    } else {
      const output = {
        firstName: xss(this.firstName),
        lastName: xss(this.lastName),
        email: xss(this.email),
        phone: xss(this.phone),
        message: xss(this.message),
      }
      return output;
    }
  }
}

export default ContactForm;
