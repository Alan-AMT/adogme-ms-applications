export interface SendEmailParams {
  to: string | string[];
  subject: string;
  template: EmailTemplate;
  context: Record<string, any>;
}

export enum EmailTemplate {
  APPLICATION_REQUEST_RECEIVED = 'application-request-received',
  APPLICATION_APPROVED = 'application-approved',
  APPLICATION_REJECTED = 'application-rejected',
}
  

export abstract class EmailSenderPort {
  abstract sendEmail(params: SendEmailParams): Promise<void>;
}
