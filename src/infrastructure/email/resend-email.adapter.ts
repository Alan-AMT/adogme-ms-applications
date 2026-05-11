import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailSenderPort, SendEmailParams, EmailTemplate } from '../../domain/email-sender.port.js';

@Injectable()
export class ResendEmailAdapter implements EmailSenderPort {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendEmailAdapter.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    try {
      const htmlContent = this.getHtmlForTemplate(params.template, params.context);

      const { data, error } = await this.resend.emails.send({
        from: 'Adogme <onboarding@resend.dev>', // Update this to your verified domain later
        to: params.to,
        subject: params.subject,
        html: htmlContent,
      });

      if (error) {
        this.logger.error(`Error sending email with Resend: ${error.message}`);
        throw new Error(`Email sending failed: ${error.message}`);
      }

      this.logger.log(`Email sent successfully: ${data?.id}`);
    } catch (err) {
      this.logger.error('Exception during email send', err);
      throw err;
    }
  }

  private getHtmlForTemplate(template: EmailTemplate, context: Record<string, any>): string {
    // In a real application, you might use a template engine like EJS, Handlebars, 
    // or react-email to generate this HTML dynamically based on the context.
    switch (template) {
      case 'application-request-received':
        return `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Hola ${context.applicantName || 'Adopter'}!</h2>
            <p>Hemos recibido tu solicitud de adopción para el perrito <strong>${context.dogName || 'que elegiste'}</strong>.</p>
            <p>El refugio revisará tu solicitud pronto y te contactaremos con más detalles.</p>
            <br />
            <p>Saludos,</p>
            <p>El equipo de Adogme</p>
          </div>
        `;
      case 'application-approved':
        return `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Felicidades ${context.applicantName || 'Adopter'}!</h2>
            <p>Tu solicitud de adopción para <strong>${context.dogName || 'el perrito'}</strong> ha sido aprobada.</p>
            <p>Nos pondremos en contacto contigo para los siguientes pasos.</p>
          </div>
        `;
      case 'application-rejected':
        return `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hola ${context.applicantName || 'Adopter'},</h2>
            <p>Lamentamos informarte que tu solicitud de adopción no ha sido aprobada en esta ocasión.</p>
            <p>Te invitamos a seguir buscando a tu compañero ideal en nuestra plataforma.</p>
          </div>
        `;
      default:
        return `<p>New notification from Adogme</p>`;
    }
  }
}
