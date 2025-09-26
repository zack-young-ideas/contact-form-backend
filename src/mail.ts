import sendEmail from './drivers';

interface MailObject {
  template: string;
  variables: {
    title: string;
    content: string;
  }
}

interface AdminMailObject {
  content: string;
}

const mail = {
  sendMail: async (mailObject: MailObject) => {
    sendEmail();
  },

  contactAdmin: (mailObject: AdminMailObject) => {
    sendEmail();
  },
};

export default mail;
