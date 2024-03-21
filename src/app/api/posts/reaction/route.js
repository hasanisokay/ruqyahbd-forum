import dbConnect from "@/services/DbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { postID, action, actionByUsername, commentID } = body;

  try {
    const db = await dbConnect();
    const postCollection = db?.collection("posts");

    if (action === "like") {
      if (commentID) {
        const result = await postCollection.updateOne(
          {
            _id: new ObjectId(postID),
            "comment._id": new ObjectId(commentID),
          },
          { $addToSet: { "comment.$.likes": actionByUsername } }
        );
        if (result.modifiedCount === 1) {
          return NextResponse.json({
            status: 200,
            message: "Comment liked successfully.",
          });
        } else {
          return NextResponse.json({
            status: 400,
            message: "Failed to like the comment.",
          });
        }
      }
      const result = await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $addToSet: { likes: actionByUsername } }
      );

      if (result.modifiedCount === 1) {
        return NextResponse.json({
          status: 200,
          message: "Post liked successfully.",
        });
      } else {
        return NextResponse.json({
          status: 400,
          message: "Failed to like the post.",
        });
      }
    } else if (action === "dislike") {
      if (commentID) {
        const result = await postCollection.updateOne(
          {
            _id: new ObjectId(postID),
            "comment._id": new ObjectId(commentID),
          },
          { $pull: { "comment.$.likes": actionByUsername } }
        );
        if (result.modifiedCount === 1) {
          return NextResponse.json({
            status: 200,
            message: "Comment disliked successfully.",
          });
        } else {
          return NextResponse.json({
            status: 400,
            message: "Failed to dislike the comment.",
          });
        }
      }
      const result = await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { likes: actionByUsername } }
      );

      if (result.modifiedCount === 1) {
        return NextResponse.json({
          status: 200,
          message: "Post disliked successfully.",
        });
      } else {
        return NextResponse.json({
          status: 400,
          message: "Failed to dislike the post.",
        });
      }
    } 
    else if(action==="hate"){
      if (commentID) {
        const result = await postCollection.updateOne(
          {
            _id: new ObjectId(postID),
            "comment._id": new ObjectId(commentID),
          },
          { $addToSet: { "comment.$.dislikes": actionByUsername } }
        );
        if(result.modifiedCount === 1) {
          return NextResponse.json({
            status: 200,
            message: "Comment hated successfully.",
          });
        } else {
          return NextResponse.json({
            status: 400,
            message: "Failed to hate the comment.",
          });
        }
      }
      const result = await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $addToSet: { dislikes: actionByUsername } }
      );

      if (result.modifiedCount === 1) {
        return NextResponse.json({
          status: 200,
          message: "Post hated successfully.",
        });
      } else {
        return NextResponse.json({
          status: 400,
          message: "Failed to hate the post.",
        });
      }
    }
    else if(action==="unhate"){
      if (commentID) {
        const result = await postCollection.updateOne(
          {
            _id: new ObjectId(postID),
            "comment._id": new ObjectId(commentID),
          },
          { $pull: { "comment.$.dislikes": actionByUsername } }
        );
        if (result.modifiedCount === 1) {
          return NextResponse.json({
            status: 200,
            message: "Comment unhated successfully.",
          });
        } else {
          return NextResponse.json({
            status: 400,
            message: "Failed to unhate the comment.",
          });
        }
      }
      const result = await postCollection.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { dislikes: actionByUsername } }
      );

      if (result.modifiedCount === 1) {
        return NextResponse.json({
          status: 200,
          message: "Post unhated successfully.",
        });
      } else {
        return NextResponse.json({
          status: 400,
          message: "Failed to unhate the post.",
        });
      }
    }
    else {
      return NextResponse.json({
        status: 400,
        message: "Invalid action. Must be among 'like' 'dislike' 'hate', 'unhate'.",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};
