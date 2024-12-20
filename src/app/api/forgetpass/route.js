import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const POST = async (request) => {
  const body = await request.json();
  const { username, email } = body;

  try {
    const db = await dbConnect();
    const userCollection = db.collection("users");
    const result = await userCollection.findOne(
      { username: username, email: email },
      { projection: { _id: 1, name: 1 } }
    );
    if (result?._id) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const sendOTPEmail = async (email, otp) => {
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
            <p style="font-size: 16px; color: #333;">Dear <span style="font-weight: 600;">${result?.name}</span>,</p>
            <p style="font-size: 14px; color: #666;">Your OTP for password reset is: <strong style="color: #333;">${otp}</strong>. It will expire within 10 minutes from now.</p>
            <p style="font-size: 14px; color: #666;">If you face any problem, please contact us at <a href="mailto:ruqyahbdforum@gmail.com">ruqyahbdforum@gmail.com</a>.</p>
            <p style="font-size: 14px; color: #666;">Team Ruqyahbd Forum</p>
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
              Data: "Password Reset OTP",
            },
          },
          Source: process.env.PASSWORD_RECOVERY_EMAIL_ID,
        };

        try {
          await sesClient.send(new SendEmailCommand(params));
          console.log("Email sent");
        } catch (error) {
          console.error("Error sending email:", error);
        }
      };
      sendOTPEmail(email, otp);

      const expirationTime = new Date();
      expirationTime.setTime(expirationTime.getTime() + 10 * 60 * 1000);

      await userCollection.updateOne(
        { _id: new ObjectId(result._id) },
        {
          $set: {
            resetOTP: {
              value: otp,
              expirationTime: expirationTime,
            },
          },
        }
      );
      return NextResponse.json({
        status: 200,
        message: "We have sent you an OTP. Please check your email.",
      });
    } else {
      return NextResponse.json({
        status: 404,
        message: "Invalid username or email.",
      });
    }
  } catch {
    return NextResponse.json({
      status: 500,
      message: "Server error.",
    });
  }
};
