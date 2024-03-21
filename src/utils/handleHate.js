import toast from "react-hot-toast";
const handleHate = async (
  id,
  actionByUsername,
  posts,
  setPosts,
  commentID = undefined, 
) => {
  if (!actionByUsername) {
    return toast.error("Log in to react");
  }
  const dataToSend = {
    postID: id,
    action: "hate",
    actionByUsername,
  };
  if (commentID) {
    dataToSend.commentID = commentID;
  }
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    };

    const response = await fetch("/api/posts/reaction", requestOptions);
    const data = await response.json();
    if (data?.status === 200) {
      let updatedPosts;
      if (posts?.length > 1) {
        updatedPosts = posts?.map((post) => {
          if (post?._id === id) {
            if (post?.dislikes?.length > 0) {
              post.dislikes = [...post.dislikes, actionByUsername];
            } else {
              post.dislikes = [actionByUsername];
            }
          }
          return post;
        });
        setPosts(updatedPosts);
      } else {
        if (data?.status === 200 && commentID) {
          setPosts((prevPost) => ({
            ...prevPost,
            comment: prevPost.comment.map((c) =>
              c?._id === commentID
                ? {
                    ...c,
                    dislikes: [...c.dislikes, actionByUsername],
                  }
                : c
            ),
          }));
        }
        if (data?.status === 200 && !commentID) {
            if (posts?.dislikes?.length > 0) {
              setPosts((prevPost) => ({
                ...prevPost,
                dislikes: [...prevPost?.dislikes, actionByUsername],
              }));
            } else {
              setPosts((prevPost) => ({
                ...prevPost,
                dislikes: [actionByUsername],
              }));
            }
        }
      }

    }
  } catch (error) {
    console.error("Error disliking post:", error);
  }
};
export default handleHate;
