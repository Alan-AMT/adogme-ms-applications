export interface SendEmailParams {
  to: string | string[];
  subject: string;
  template: EmailTemplate;
  context: Record<string, any>;
}

export enum EmailTemplate {
  APPLICATION_REQUEST_RECEIVED = 'application-request-received',
  APPLICATION_CREATED_CONFIRMATION = 'application-created-confirmation',
  APPLICATION_CANCELLED_SHELTER = 'application-cancelled-shelter',
  APPLICATION_STATUS_UPDATED = 'application-status-updated',
  APPLICATION_APPROVED = 'application-approved',
  APPLICATION_REJECTED = 'application-rejected',
}
  

export abstract class EmailSenderPort {
  abstract sendEmail(params: SendEmailParams): Promise<void>;
}
