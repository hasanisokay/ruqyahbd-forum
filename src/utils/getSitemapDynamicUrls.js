"use server";

import dbConnect from "@/services/DbConnect";

const getSitemapDynamicUrls = async () => {
    try {
    const db = await dbConnect();
    const postsCollection = db.collection("posts");
    const postIds = await postsCollection.find().project({ _id: 1 }).toArray();
    return postIds;
  } catch {
    return [];
  }
};

export default getSitemapDynamicUrls;
