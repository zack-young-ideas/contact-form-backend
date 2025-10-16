# Contact Form Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0-brightgreen)
![AWS SES](https://img.shields.io/badge/AWS_SES-supported-orange)

A REST API that accepts POST requests to submit contact information.

## Features

- **MySQL Backend** - each user's contact info is stored in a MySQL database
- **Sends Email** - automatically sends acknowledgment emails to users using AWS Simple Email Service

## About

This API is meant to serve as the backend for a front-end web application that displays a contact form to users. It works best when used with the React contact form app at [contact-form](https://github.com/zack-young-ideas/contact-form).

There are two API endpoints defined by this app:
- **GET /api/csrf** - returns a secret value and a token that are used to prevent cross-site request forgery attempts
- **POST /api/contact** - accepts contact form info; must include the secret value and token provided in GET requests to /api/csrf

A MySQL database is required for storing contact information from users. When the `npm run build` command is run, a new table is created in the database that will store contact info submitted by users.

The API is designed to run on AWS EC2 with SES permissions, but can also be run using the 'local' email driver that writes emails to local files on disk.

When POST requests are sent to the /api/contact endpoint, an acknowledgement email is sent to the email address included in the POST request. A second email is sent to the admin of the site. These emails are composed using email template files that must include specific template variables described below.

## Pre-Installation

Before building and running the contact form API, you must create a new MySQL database and a user that has permission to create tables.

Furthermore, Node.js must be installed on your system. If you intend to send emails using AWS, you will need to run the API on an EC2 instance, verify a domain name or email address identity with AWS SES, and assign a role to the EC2 instance granting it permission to send emails. There are no SMTP credentials required.

### Database

To get MySQL set up, run the following commands:

```sql
CREATE DATABASE IF NOT EXISTS contact_form;
CREATE USER 'contact_form_admin'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON contact_form.* TO 'contact_form_admin'@'localhost';
FLUSH PRIVILEGES;
```

Run `mysql -u contact_form_admin -p` to test that the user you've created is able to connect to MySQL.

### AWS Setup

If you intend to use AWS Simple Email Service to send emails, create a new role using AWS IAM, attach the following policy to it, and assign the role to an EC2 instance:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "ses:SendEmail",
            "Resource": "*"
        }
    ]
}
```

## Environment

The API requires several environment variables to be defined. These may be part of the environment in which the app is running or they can be defined in an .env file passed as an argument to the `npm run build` and `npm run start` commands.

#### Required Environment Variables
- **DATABASE_USER** - the username of the MySQL user
- **DATABASE_PASSWORD** - the password of the MySQL user
- **DATABASE_NAME** - the name of the MySQL database to be used
- **DATABASE_HOST** - the host on which the MySQL server is running
- **EMAIL_DRIVER** - choices are 'local' or 'aws'
- **EMAIL_TEMPLATE_DIR** - the directory containing email template files to use when sending emails
- **EMAIL_ADMIN_ADDRESS** - the email address of the site admin
- **EMAIL_FROM_ADDRESS** - the email address that all emails are sent from
- **EMAIL_FILEPATH** - the directory to write emails to if not using AWS; this environment variable is only required if EMAIL_DRIVER is set to 'local'

#### Optional Environment Variables
- **DATABASE_CHARSET** - the charset used to connect to the MySQL server
- **DATABASE_PORT** - specifies a port to use when connecting to the MySQL server
- **DATABASE_TIMEZONE** - the timezone to use when connecting to MySQL

## Email Templates

At least four email template files must exist within the directory specified by the EMAIL_TEMPLATE_DIR environment variable: acknowledgement.txt, acknowledgement.html, admin.txt, and admin.html. These templates are rendered with variables provided in the POST request to /api/contact. The rendered templates are then included in emails sent to the user and the site admin.

Example template files can be found in the templates directory. Template variables must be delimited using double curly braces, such as `{{ variable_1 }}`.

The acknowledgement.txt and acknowledgement.html template files must define the following variables:
- **firstName** - the first name submitted in the POST request to /api/contact

The admin.txt and admin.html template files must define the following variables:
- **firstName** - the first name submitted in the POST request to /api/contact
- **lastName** - the last name submitted in the POST request to /api/contact
- **email** - the email address submitted in the POST request to /api/contact
- **message** - the message submitted by the user in the POST request to /api/contact

## Installation

```bash
git clone https://github.com/zack-young-ideas/contact-form-backend.git
cd contact-form-backend
npm install
npm run build
npm run start
```

The `npm run build` and the `npm run start` commands both accept an optional argument that specifies an .env file to use. For instance, `npm run build -- --env=.env` and `npm run start -- --env=.env`.

## Author

Zack Young

## License

This project is open source and available under the [MIT License](LICENSE).
