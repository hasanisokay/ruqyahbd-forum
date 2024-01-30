import toast from "react-hot-toast";

const handleDeletePost = async (id, isAuthorized) => {
  if (!isAuthorized) return;

  const dataToSend = {
    postID: id,
    action: "delete",
  };

  try {
    const response = await fetch("/api/posts/changestatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      const data = await response.json();
      toast.success(data?.message);
    } else {
      const data = await response.json();
      toast.error(data?.message);
    }
  } catch (error) {
    console.error("Error while deleting post:", error);
    toast.error("An error occurred while deleting the post");
  }
};

export default handleDeletePost;
