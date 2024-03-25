'use server'
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sendEmail = async (email, subject, htmlMessage, emailFrom) => {
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
        ${htmlMessage}
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
        Data: subject,
      },
    },
    Source: emailFrom || process.env.WELCOMING_EMAIL_ID,
  };

  try {
    await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Propagate the error to the caller
  }
};
export default sendEmail;