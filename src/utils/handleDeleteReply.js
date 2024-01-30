import toast from "react-hot-toast";

const handleDeleteReply = async (postID, commentID, replyID) => {
  try {
    const response = await fetch("/api/posts/deletecomment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postID, commentID, replyID }),
    });

    if (response.ok) {
      const data = await response.json();
      toast.success(data?.message);
      return true;
    } else {
      const data = await response.json();
      toast.error(data?.message);
      return false;
    }
  } catch (error) {
    console.error("Error while deleting reply:", error);
    toast.error("An error occurred while deleting the reply");
    return false;
  }
};

export default handleDeleteReply;
