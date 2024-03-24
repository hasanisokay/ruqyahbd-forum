'use server'
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const sendWelcomeEmail = async (email, username, name) => {
    const sesClient = new SESClient({
      region: process.env.AWS_SES_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const htmlBody = `
    <html>
      <head>
        <style>
          p {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <p style="font-size: 16px; color: #333;">Dear <span style="font-weight: 600;"> ${name} </span>,</p>
        <p style="font-size: 14px; color: #666;">Welcome to Ruqyahbd Forum! We're excited to have you on board.</p>
        <p style="font-size: 14px; color: #666;">Your username is: <strong>${username}</strong></p>
        <p style="font-size: 14px; color: #666;">Thank you for joining us!</p>
      </body>
    </html>
  `;
  
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: htmlBody,
          },
        },
        Subject: {
          Data: "Welcome to Ruqyahbd Forum",
        },
      },
      Source: process.env.WELCOMING_EMAIL_ID,
    };
  
    try {
      await sesClient.send(new SendEmailCommand(params));
      console.log("Welcome email sent to:", email);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw error; // Propagate the error to the caller
    }
  }
  export default sendWelcomeEmail;