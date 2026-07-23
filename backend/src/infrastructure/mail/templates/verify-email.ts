import { mailConfig } from "../../../config/mail.config.js";

export function renderVerifyEmailTemplate(token: string): string {
  const verifyUrl = `${mailConfig.appUrl}/verify-email?token=${token}`;

  return `
<!DOCTYPE html>

<html>

<head>
<meta charset="UTF-8">
<title>Verify Email</title>
</head>

<body>

<h2>Verify your email</h2>

<p>

Thank you for registering.

</p>

<p>

Please click below.

</p>

<p>

<a
href="${verifyUrl}"
style="
padding:12px 20px;
background:#16a34a;
color:white;
text-decoration:none;
border-radius:6px;
">

Verify Email

</a>

</p>

<p>

This link expires in
<strong>24 hours</strong>

</p>

</body>

</html>
`;
}
