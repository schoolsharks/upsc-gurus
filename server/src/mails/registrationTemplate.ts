export const registrationTemplate = (email: string, password: string, firstName: string) => {
  return `
   <!DOCTYPE html>
   <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to UPSC Gurus | Registration Complete</title>
      <style>
        body {
          background-color: #f4f4f9;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
        }

        .header {
          background-color: #000000;
          padding: 20px;
          text-align: center;
        }

        .logo {
          max-width: 120px;
        }

        .message {
          font-size: 1.8rem;
          color: #ffffff;
          font-weight: bold;
          margin-top: 10px;
        }

        .body {
          padding: 20px;
          text-align: center;
        }

        .greeting {
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .instruction {
          font-size: 1.2rem;
          margin-bottom: 20px;
          color: #555555;
        }

        .info {
          font-size: 1rem;
          margin-bottom: 15px;
          color: #555555;
        }

        .cta-button {
          background-color: #000000;
          color: #ffffff;
          padding: 12px 30px;
          font-size: 1.2rem;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
          margin-top: 20px;
        }

        .cta-button:hover {
          background-color: #333333;
        }

        .footer {
          background-color: #f4f4f9;
          text-align: center;
          padding: 15px;
          color: #888888;
          font-size: 0.9rem;
        }

        .footer a {
          color: #0066cc;
          text-decoration: none;
        }

        .ii a[href] {
        color: #ffffff;
      }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="message">Welcome to UPSC Gurus!</div>
        </div>
        
        <div class="body">
          <p class="greeting">Hello, ${firstName}!</p>
          <p class="instruction">
            We are excited to have you join UPSC Gurus. Your registration was successful, and your account is now active.
          </p>
          <p class="info">Your account has been created with the following details:</p>
          <p class="info">Email: ${email}</p>
          <p class="info">Password: ${password}</p>
          <p>If you did not register for UPSC Gurus, please disregard this email.</p>
          <p>To access your account, click the link below:</p>
          <a href="https://app.upscgurus.in/" class="cta-button">Go to UPSC Gurus</a>
          <p class="instruction">
            For any support, feel free to reach out to us at <a href="mailto:enquiry@upscgurus.in">enquiry@upscgurus.in</a>.
          </p>
        </div>

        <div class="footer">
          <p>&copy; 2024 UPSC Gurus, All Rights Reserved.</p>
          <p>Visit us at <a href="https://app.upscgurus.in">UPSC Gurus</a></p>
        </div>
      </div>
    </body>
  </html>
    `;
};
