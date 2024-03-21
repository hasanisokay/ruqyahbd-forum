import toast from "react-hot-toast";

const handleUnHate = async (
  id,
  actionByUsername,
  posts,
  setPosts,
  commentID = undefined
) => {
  if (!actionByUsername) {
    return toast.error("Log in to react");
  }
  const dataToSend = {
    postID: id,
    action: "unhate",
    actionByUsername,
  };
  try {
    if (commentID) {
      dataToSend.commentID = commentID;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    };
    const response = await fetch("/api/posts/reaction", requestOptions);
    const data = await response.json();
    if (posts?.length > 1) {
      if (data.status === 200) {
        const updatedPosts = posts.map((post) => {
          if (post._id === id) {
            post.dislikes = post.dislikes.filter(
              (person) => person !== actionByUsername
            );
          }
          return post;
        });
        setPosts(updatedPosts);
      }
    } else {
      if (data?.status === 200 && commentID) {
        setPosts((prevPost) => ({
          ...prevPost,
          comment: prevPost.comment.map((c) =>
            c._id === commentID
              ? {
                  ...c,
                  dislikes: c.dislikes.filter(
                    (uname) => uname !== actionByUsername
                  ),
                }
              : c
          ),
        }));
      }
      if (data?.status === 200 && !commentID) {
        const filteredLikesArray = posts?.dislikes?.filter(
          (uname) => uname !== actionByUsername
        );
        setPosts((prevPost) => ({ ...prevPost, dislikes: filteredLikesArray }));
      }
    }
  } catch (error) {
    console.error("Error disliking post:", error);
  }
};
export default handleUnHate;
