export const resetPasswordTemplate = (
  email: string,
  name: string,
  link: string
) => {
  return `
Hello ${name},<br><br>

We received a request to reset your password for your UPSC Gurus account associated with this email: ${email}.<br><br>

If you did not request this, please ignore this email.<br><br>

To reset your password, click the link below:<br>
<a href="${link}">${link}</a><br><br>

This link will expire in 10 minutes. If you need help, contact us at <a href="mailto:enquiry@upscgurus.in">enquiry@upscgurus.in</a>.<br><br>

UPSC Gurus Team
  `;
};
