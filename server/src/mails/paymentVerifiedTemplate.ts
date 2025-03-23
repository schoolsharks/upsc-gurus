export const paymentVerifiedTemplate = (email: string, name: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Payment Verified | Access Granted</title>
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
            background-color: #142E79;
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
            background-color: #142E79;
            color: #ffffff;
            padding: 12px 30px;
            font-size: 1.2rem;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
          }
  
          .cta-button:hover {
            background-color: #0a1e51;
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
  
          @media only screen and (max-width: 600px) {
            .container {
              width: 100%;
              padding: 10px;
            }
  
            .header {
              padding: 15px;
            }
  
            .body {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="https://learn.careergeek.in">
              <img class="logo" src="https://gre-test-images.s3.ap-south-1.amazonaws.com/Primary+Logo+1.png" alt="CareerGeek Logo" />
            </a>
            <div class="message">Payment Verified! Access Granted</div>
          </div>
          
          <div class="body">
            <p class="greeting">Dear ${name},</p>
            <p class="instruction">
              We are pleased to inform you that your payment has been successfully verified. You now have full access to all the features and services on the platform.
            </p>
            <p class="info">Your account is now upgraded, and you can start exploring the premium features available to you.</p>
            <p>To access your account, click the link below:</p>
            <a href="https://learn.careergeek.in/" class="cta-button">Go to CareerGeek</a>
            <p class="instruction">
              If you encounter any issues or need assistance, feel free to contact us at <a href="mailto:support@careergeek.com">support@careergeek.com</a>.
            </p>
          </div>
  
          <div class="footer">
            <p>&copy; 2024 CareerGeek, All Rights Reserved.</p>
            <p>Visit us at <a href="https://learn.careergeek.in">CareerGeek</a></p>
          </div>
        </div>
      </body>
    </html>
    `;
  };
  