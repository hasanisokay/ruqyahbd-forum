'use server'
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const sendWelcomeEmail = async (email, username, name) => {
  // const visibleChars = password.slice(0,2);
  // const hiddenChars = password.slice(2).replace(/./g, "*");
  // const maskedPassword = visibleChars + hiddenChars;

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
        <p style="font-size: 14px; color: #666;">Your email is: <strong>${email}</strong></p>
        <p style="font-size: 14px; color: #666;">Please write down your credential in a safe place.</p>
        <p style="font-size: 14px; color: #666;">If lost, you can recover your password from <a target="_blank" href="https://f.ruqyahbd.org/identity">here</a> </p>
        <p style="font-size: 14px; color: #666;">Thank you for joining us!</p>

        <!-- Bangla Version -->
        <p style="font-size: 16px; margin-top: 20px; color: #333;">প্রিয় <span style="font-weight: 600;"> ${name} </span>,</p>
        <p style="font-size: 14px; color: #666;">রুকইয়া সাপোর্ট বিডি ফোরামে আপনাকে স্বাগতম!</p>
        <p style="font-size: 14px; color: #666;">আপনার ইউজারনেম: <strong>${username}</strong></p>
        <p style="font-size: 14px; color: #666;">আপনার ই-মেইল: <strong>${email}</strong></p>
        <p style="font-size: 14px; color: #666;">আপনার ইউজারনেম এবং পাসওয়ার্ড নিরাপদ জায়গায় লিখে রাখুন।</p>
        <p style="font-size: 14px; color: #666;">পাসওয়ার্ড হারিয়ে গেলে আপনি <a target="_blank" href="https://f.ruqyahbd.org/identity">এই লিংক </a>থেকে রিকভার করতে পারবেন। </p>
        <p style="font-size: 14px; color: #666;">আমাদের সাথে থাকার জন্য আপনাকে ধন্যবাদ!</p>
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