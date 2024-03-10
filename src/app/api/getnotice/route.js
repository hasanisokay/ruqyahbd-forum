import dbConnect from "@/services/DbConnect";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server";

export const GET = async () => {
  unstable_noStore()
  try {
    const db = await dbConnect();
    const noticeCollection = db?.collection("notice");
    const result = await noticeCollection?.find().sort({ date: -1 }).toArray();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: 500, message: "Error" });
  }
};
