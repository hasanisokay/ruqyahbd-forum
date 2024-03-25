"use server"
import dbConnect from "@/services/DbConnect";
import { cookies } from "next/headers";
const getPendingCount = async () => {
  cookies();
  try {
    const db = await dbConnect();
    const postCollection = db.collection("posts");
    const pendingPostCount = await postCollection.countDocuments({
      status: "pending",
    });
    return pendingPostCount;
  } catch {
    return 0;
  }
};

export default getPendingCount;
