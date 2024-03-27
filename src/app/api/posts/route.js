import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
  const db = await dbConnect();
  const postCollection = db?.collection("posts");
  if (!db)
    return NextResponse.json({
      status: 400,
      message: "Database connection error",
    });
  try {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const result = await postCollection
      .aggregate([
        {
          $match: { status: "approved" },
        },
        {
          $addFields: {
            // Add a field to check if there are any comments
            hasComments: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: 0 } },
            // Add a field to check if there are any replies
            hasReplies: { $cond: { if: { $isArray: "$comment.replies" }, then: { $size: "$comment.replies" }, else: 0 } },
          },
        },
        {
          $sort: {
            // Sort first by comment date if there are comments
            "comment.date": -1,
            // If no comments, sort by replies date if there are replies
            "comment.replies.date": -1,
            // If both comment and replies are empty, sort by post date
            date: -1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: pageSize,
        },
        {
          $lookup: {
            from: "users",
            localField: "author.username",
            foreignField: "username",
            as: "authorInfo",
          },
        },
        {
          $unwind: "$authorInfo",
        },
        {
          $project: {
            _id: 1,
            post: 1,
            date: 1,
            comment: { $size: { $ifNull: ["$comment", []] } },
            photos: 1,
            videos: 1,
            likes: 1,
            dislikes:1,
            "authorInfo.name": 1,
            "authorInfo.photoURL": 1,
            "authorInfo.isAdmin": 1,
            "authorInfo.joined": 1,
            "authorInfo.username": 1,
          },
        },
      ])
      .toArray();
    return NextResponse.json(result);
  } catch(err) {
    console.log(err);
    return NextResponse.json({ status: 404, message: "Error on server" });
  }

  // const result = await postCollection.find({ status: "approved" }).sort({ date: -1 }).skip(skip).limit(pageSize).toArray();
};
