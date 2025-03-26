export const passwordResetConfirmationTemplate = (email: string, firstName: string, newPassword: string) => {
  return `
Hello ${firstName},

We wanted to let you know that your UPSC Gurus account password has been successfully reset.

Email ID: ${email}  
Your new password is: ${newPassword}  

If you did not request this password reset, please contact us immediately.  

To access your UPSC Gurus account, click the link below:  
https://app.upscgurus.in  

For any issues or questions, feel free to reach out to us at: <a href="enquiry@upscgurus.in">enquiry@upscgurus.in</a>  

Best regards,  
UPSC Gurus Team  
  `;
};
