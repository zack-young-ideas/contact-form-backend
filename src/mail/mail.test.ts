import { sendAcknowledgementEmail, sendAdminEmail } from './mail';
import sendEmail from './drivers';
import { renderTemplate } from '../utils';

jest.mock('./drivers');
jest.mock('../utils');

// Set required environment variables.
process.env.EMAIL_TEMPLATE_DIR = '/home/templates';
process.env.EMAIL_ADMIN_ADDRESS = 'admin@example.com';

beforeEach(() => {
  sendEmail = jest.fn();
  renderTemplate = jest.fn(() => '<h1>Template Output</h1>');
});

afterEach(() => jest.resetAllMocks());

const mailObject = {
  recipient: 'user@example.com',
  template: 'template',
  variables: { name: 'Jack Kelly' },
}

describe('sendAdminEmail', () => {
  it('calls sendEmail', async () => {
    expect(sendEmail).toHaveBeenCalledTimes(0);

    await sendAdminEmail(mailObject)

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      'user@example.com',
      '<h1>Template Output</h1>',
      '<h1>Template Output</h1>'
    );
  });

  it('calls renderTemplate', async () => {
    expect(renderTemplate).toHaveBeenCalledTimes(0);

    await sendAdminEmail(mailObject)

    expect(renderTemplate).toHaveBeenCalledTimes(2);
    expect(renderTemplate).toHaveBeenCalledWith(
      '/home/templates/template.html',
      { name: 'Jack Kelly' }
    );
    expect(renderTemplate).toHaveBeenCalledWith(
      '/home/templates/template.txt',
      { name: 'Jack Kelly' }
    );
  });
});

describe('sendAcknowledgementEmail', () => {
  it('calls sendEmail', async () => {
    expect(sendEmail).toHaveBeenCalledTimes(0);

    await sendAcknowledgementEmail(mailObject)

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      'user@example.com',
      '<h1>Template Output</h1>',
      '<h1>Template Output</h1>'
    );
  });

  it('calls renderTemplate', async () => {
    expect(renderTemplate).toHaveBeenCalledTimes(0);

    await sendAdminEmail(mailObject)

    expect(renderTemplate).toHaveBeenCalledTimes(2);
    expect(renderTemplate).toHaveBeenCalledWith(
      '/home/templates/template.html',
      { name: 'Jack Kelly' }
    );
    expect(renderTemplate).toHaveBeenCalledWith(
      '/home/templates/template.txt',
      { name: 'Jack Kelly' }
    );
  });
});
