# Contact Form Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A REST API that accepts POST requests to submit contact information.

## Features

- **MySQL Backend** - each user's contact info is stored in a MySQL database
- **Sends Email** - automatically sends acknowledgment emails to users using AWS Simple Email Service

## About

This API is meant to serve as the backend for a front-end web application that displays a contact form to users. It works best when used with the React contact form app at [contact-form](https://github.com/zack-young-ideas/contact-form).

There are two API endpoints defined by this app:
- **GET /api/csrf** - returns a secret value and a token that are used to prevent cross-site request forgery attempts
- **POST /api/contact** - accepts contact form info; must include the secret value and token provided in GET requests to /api/csrf

A MySQL database is required for storing contact information from users. When the `build` command is run, a new table is created in the database that will store the contact info submitted by each user.

This API is expected to be run on an AWS EC2 instance with permission to send emails via AWS Simple Email Service, but this is not required. The API comes with two email drivers, one that sends emails via AWS SES, and another that simply writes emails to local files on disk. 

When POST requests are sent to the /api/contact endpoint, an acknowledgement email is sent to the email address included in the POST request. A second email is sent to the admin of the site. These emails are composed using email template files that must include specific variables described below.

## Pre-Installation

Before building and running the contact form API, you must create a new MySQL database. There must be a user that has permission to create a new table and insert data into this table.

Furthermore, Node.js must be installed on your system. If your intention is to send emails using AWS, you will need to run the API on an EC2 instance, verify a domain name or email address identity with AWS SES, and assign a role to the EC2 instance granting it permission to send emails. There are no SMTP credentials required. The API assumes the EC2 instance it is installed on has a role that enables sending emails.

To get MySQL set up, run the following commands:

```sql
CREATE DATABASE IF NOT EXISTS contact_form;
```

```sql
CREATE USER 'contact_form_admin'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON contact_form.* TO 'contact_form_admin'@'localhost';
FLUSH PRIVILEGES;
```

Run `mysql -u contact_form_admin -p` to test that the user you've created is able to connect to the MySQL database properly.

If you intend to use AWS Simple Email Service to send emails, create a new role using AWS IAM and attach the following policy to it:

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

## Installation

```bash
git clone https://github.com/zack-young-ideas/contact-form-backend.git
cd contact-form-backend
npm install
npm run build
npm run start
```

The `npm run build` and the `npm run start` commands both accept an optional argument that specifies an .env file to use. For instance, `npm run build -- --env=.env` and `npm run start -- --env=.env`.
