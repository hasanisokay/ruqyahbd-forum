"use server"
import dbConnect from "@/services/DbConnect";

const handleRemoveAdmin = async (username) => {
  try {
    const db = await dbConnect();
    const userCollection = db.collection("users");
    const result = await userCollection.updateOne(
      { username: username },
      { $set: { isAdmin: false } }
    );
    if (result.modifiedCount === 1) {
      return {message:"Removed as Admin", status:200};
    } else {
      return {message:"Could not remove. Maybe this is a duplicate request. Reload and try again.", status:400};
    }
  } catch {
    return {message:"Error on server. Try again after few hours.", status: 500};
  }
};

export default handleRemoveAdmin;
