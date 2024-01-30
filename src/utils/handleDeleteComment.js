import toast from "react-hot-toast";

const handleDeleteComment = async (postID, commentID) => {
  try {
    const response = await fetch("/api/posts/deletecomment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentID, postID }),
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
    console.error("Error while deleting comment:", error);
    toast.error("An error occurred while deleting the comment");
    return false;
  }
};

export default handleDeleteComment;
