export interface MailObject {
  recipient: string;
  template: string;
  variables: {
    [key: string]: string;
  }
}
