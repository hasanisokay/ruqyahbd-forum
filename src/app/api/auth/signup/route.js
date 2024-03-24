import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import sendWelcomeEmail from "@/utils/sendWelcomeEmail.mjs";
/**
 * @type {import("mongodb").Db}
 */
export const POST = async (request) => {
  const body = await request.json();
  const password = body.password;
  const username = body.username;


  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    body.password = hashedPassword;
    
    const db = await dbConnect();
    const userCollection = db?.collection("users");
    const usernameCollection = db?.collection("usernames");
    body.isAdmin = false;
    body.notifications = [];
    await userCollection.insertOne(body);
    await usernameCollection.insertOne({ username });
    await sendWelcomeEmail(body.email, body.username, body.name);
    return NextResponse.json({ status: 200, message: "User Created" });
  } catch {
    return NextResponse.json({ status: 404, message: "Something went wrong" });
  }
};