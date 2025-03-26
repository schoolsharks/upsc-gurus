export const passwordResetConfirmationTemplate = (email: string, firstName: string, newPassword: string) => {
  return `
Hello ${firstName},<br/><br/>

We wanted to let you know that your UPSC Gurus account password has been successfully reset.<br/>

Email ID: ${email}<br/>
Your new password is: ${newPassword}<br/><br/>

If you did not request this password reset, please contact us immediately. <br/><br/> 

To access your UPSC Gurus account, click the link below:<br/>  
<a href="https://app.upscgurus.in">https://app.upscgurus.in</a> <br/><br/>

For any issues or questions, feel free to reach out to us at: <a href="enquiry@upscgurus.in">enquiry@upscgurus.in</a> <br/> 
<br/>
Best regards,<br/>  
UPSC Gurus Team  
  `;
};
