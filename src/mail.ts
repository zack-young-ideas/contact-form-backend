import { sendAWSEmail, sendLocalEmail } from './drivers';

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
    return;
  },

  contactAdmin: (mailObject: AdminMailObject) => {
    return;
  },
};

export default mail;
