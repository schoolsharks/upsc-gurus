export const registrationTemplate = (email: string, password: string, firstName: string) => {
  return `
Hello ${firstName},

Welcome to UPSC Gurus!  

We are excited to have you join us. Your registration was successful, and your account is now active.  

Your account details:  
Email: ${email}  
Password: ${password}  

If you did not register for UPSC Gurus, please disregard this email.  

To access your account, click the link below:  
https://app.upscgurus.in/  

For any support, feel free to reach out to us at:  
enquiry@upscgurus.in  

Best regards,  
UPSC Gurus Team  
https://app.upscgurus.in  

© 2024 UPSC Gurus, All Rights Reserved.  
  `;
};
