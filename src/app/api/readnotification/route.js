import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { id, username } = body;

  try {
    const db = await dbConnect();
    const userCollection = db.collection("users");
    const result = await userCollection.updateOne(
      {
        username: username,
        "notifications.postID": id,
      },
      {
        $set: {
          "notifications.$[element].read": true,
        },
      },
      {
        arrayFilters: [{ "element.postID": id }],
      }
    );

    if (result.matchedCount > 0) {
      return NextResponse.json({
        status: 200,
        message: "Notifications updated successfully",
      });
    } else {
      return NextResponse.json({
        status: 404,
        message: "Not Found",
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
