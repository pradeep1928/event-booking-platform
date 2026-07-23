import { mailConfig } from '../../../config/mail.config.js';

export function renderForgotPasswordTemplate(
  token: string,
): string {

  const resetUrl =
    `${mailConfig.appUrl}/reset-password?token=${token}`;

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>

<title>Password Reset</title>

</head>

<body
style="
font-family:Arial;
line-height:1.6;
">

<h2>Password Reset</h2>

<p>

We received a request to reset your password.

</p>

<p>

Click the button below.

</p>

<p>

<a
href="${resetUrl}"
style="
padding:12px 20px;
background:#2563eb;
color:white;
text-decoration:none;
border-radius:5px;
">

Reset Password

</a>

</p>

<p>

This link expires in
<strong>15 minutes</strong>.

</p>

<p>

If you didn't request this,
please ignore this email.

</p>

</body>

</html>
`;
}