class ContactForm {
  constructor(args) {
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.email = args.email;
    this.phone = args.phone;
    this.message = args.message;
    this.errors = [];
  }

  isValid() {
    let output = false;
    if (!this.firstName) {
      this.errors.push('Invalid first name');
    }
    if (!this.lastName) {
      this.errors.push('Invalid last name');
    }
    if (!this.email) {
      this.errors.push('Invalid email address');
    }
    if (this.errors.length === 0) {
      output = true;
    }
    return output;
  }
}

export default ContactForm;
