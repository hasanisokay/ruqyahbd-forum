import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await dbConnect();
    const noticeCollection = db?.collection("notice");
    const result = await noticeCollection?.find().sort({ date: -1 }).toArray();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: 500, message: "Error" });
  }
};
