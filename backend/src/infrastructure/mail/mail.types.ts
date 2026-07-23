import type Mail from 'nodemailer/lib/mailer/index.js';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;

  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;

  attachments?: Mail.Attachment[];
}