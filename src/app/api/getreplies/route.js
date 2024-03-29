import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const postID = request.nextUrl.searchParams.get('postID');
    const commentID = request.nextUrl.searchParams.get('commentID');
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize')) || 500;

    if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
        return NextResponse.json({
            status: 400,
            message: "Invalid page or pageSize parameters",
        });
    }


    try {
        const db = await dbConnect();
        const postCollection = db.collection("posts");
    
        const replies = await postCollection.aggregate([
            { $match: { _id: new ObjectId(postID), "comment._id": new ObjectId(commentID) } },
            { $unwind: "$comment" },
            { $match: { "comment._id": new ObjectId(commentID) } },
            { $project: { _id: 0, replies: "$comment.replies" } },
            { $unwind: "$replies" },
            {
                $sort: {
                    "replies.date": 1, // Sort replies by date in descending order
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "replies.author",
                    foreignField: "username",
                    as: "authorInfo",
                },
            },
            { $unwind: "$authorInfo" },
            {
                $replaceRoot: {
                    newRoot: {
                        "authorInfo": {
                            name: "$authorInfo.name", // Use the unwinded authorInfo
                            photoURL: "$authorInfo.photoURL",
                            username: "$authorInfo.username",
                        },
                        "reply": "$replies.reply",
                        "date": "$replies.date",
                        "likes": "$replies.likes",
                        "_id": "$replies._id",
                    },
                },
            },
            { $skip: pageSize * (page - 1) },
            { $limit: pageSize },
        ]).toArray();

        if (!replies || replies.length === 0) {
            return NextResponse.json({
                status: 404,
                message: "Replies not found",
            });
        }
        return NextResponse.json({
            status: 200,
            replies,
        });
    } catch (error) {
        console.error("Error fetching replies:", error);
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};
