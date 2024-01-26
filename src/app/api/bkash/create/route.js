import generateInvoiceNumber from "@/utils/generateInvoiceNumber";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const paymentReference = body.donationScheme;
  const paymentAmount = body.amount;
  console.log(body);
  try {
    const responseFromGrantToken = await fetch(process.env.GrantTokenAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: process.env.SandboxCredentials_Username,
        password: process.env.SandboxCredentials_Password,
      },
      body: JSON.stringify({
        app_key: process.env.SandboxCredentials_AppKey,
        app_secret: process.env.SandboxCredentials_AppSecretKey,
      }),
    });
    const responseDataFromGrantToken = await responseFromGrantToken.json();
    if (!responseDataFromGrantToken?.id_token) {
      return NextResponse.json({
        status: 400,
        message: "Token generate failed.",
      });
    }
console.log(responseDataFromGrantToken);
    //    got the id_token. now time to create payment.

    const responseFromCreatePayment = await fetch(
      process.env.CreatePaymentAPI,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: responseDataFromGrantToken?.id_token,
          "x-app-key": process.env.SandboxCredentials_AppKey,
        },
        body: JSON.stringify({
          mode: "0011",
          payerReference: paymentReference,
          callbackURL: `${process.env.NEXT_PUBLIC_BASEURL}/api/bkash/bkashcallback`,
          amount: paymentAmount,
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: generateInvoiceNumber(),
        }),
      }
    );
    const responseDataFromCreatePayment =
      await responseFromCreatePayment.json();
    const bkashURL = responseDataFromCreatePayment.bkashURL;
    console.log(bkashURL);
    return NextResponse.json({ bkashURL });
  } catch {
    return NextResponse.json({
      status: 500,
      message: "Grant token failed. Try again",
    });
  }
};
