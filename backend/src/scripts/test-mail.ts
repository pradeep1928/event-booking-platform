import { mailService } from '../infrastructure/mail/mail.service.js';
import { renderForgotPasswordTemplate } from '../infrastructure/mail/templates/forgot-password.js';

async function main() {

  await mailService.send({

    to: 'your-test-email@example.com',

    subject: 'Testing Mail Service',

    html: renderForgotPasswordTemplate(
      'sample-token-123',
    ),

  });

  console.log(
    'Email sent successfully',
  );

}

main().catch(console.error);