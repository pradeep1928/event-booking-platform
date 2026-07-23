import nodemailer from 'nodemailer';
import { mailConfig } from '../../config/mail.config.js';
import type { SendMailOptions } from './mail.types.js';

class MailService {

  private transporter =
    nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: false,

      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
    });

  async send(
    options: SendMailOptions,
  ): Promise<void> {

    await this.transporter.sendMail({
      from: mailConfig.from,
      ...options,
    });

  }

}

export const mailService = new MailService();