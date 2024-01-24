import dbConnect from "@/services/DbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const username = request?.nextUrl?.searchParams?.get("username");
  const allpostby = request?.nextUrl?.searchParams?.get("allpostby");
  if (!username && !allpostby) {
    return NextResponse.json({ status: 400, message: "Forbidden" });
  }
  const db = await dbConnect();
  const userCollection = db?.collection("users");
  const postCollection = db?.collection("posts");
  if (username) {
    const aggregationPipeline = [
      // Match user by username
      {
        $match: { username: username },
      },
      // Project user fields excluding password and notifications
      {
        $project: { password: 0, _id: 0, notifications: 0 },
      },
      // Lookup to get post counts
      {
        $lookup: {
          from: "posts",
          let: { authorUsername: "$username" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$author.username", "$$authorUsername"] },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                pending: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                },
                approved: {
                  $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
                },
                declined: {
                  $sum: { $cond: [{ $eq: ["$status", "declined"] }, 1, 0] },
                },
              },
            },
          ],
          as: "postCounts",
        },
      },
      // Unwind the array from lookup
      {
        $unwind: { path: "$postCounts", preserveNullAndEmptyArrays: true },
      },
    ];
    const result = await userCollection
      .aggregate(aggregationPipeline)
      .toArray();
    if (result.length === 0) {
      return NextResponse.json({ status: 404, message: "User not found" });
    }

    return NextResponse.json({ status: 200, user: result[0] });
  } else if (allpostby) {
    const aggregationPipeline = [
      // Match posts by author username
      {
        $match: { "author.username": allpostby },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          post: 1,
          status: 1,
          approveDate: 1,
          photos:1,
          videos:1,
          comment: { $size: "$comment" },
          likes: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
    ];

    const result = await postCollection
      .aggregate(aggregationPipeline)
      .toArray();

    if (result) {
      return NextResponse.json({ status: 200, posts: result });
    } else {
      return NextResponse.json({ status: 404, message: "Server Error" });
    }
  }
};