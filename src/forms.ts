import validator from 'validator';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

class ContactForm {
  constructor(args: FormData) {
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.email = args.email;
    this.phone = args.phone;
    this.message = args.message;
    this.errors = [];
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
    if (!validator.isMobilePhone(this.phone)) {
      this.errors.push('Invalid phone number');
    }
    if (this.errors.length === 0) {
      output = true;
    }
    return output;
  }
}

export default ContactForm;
