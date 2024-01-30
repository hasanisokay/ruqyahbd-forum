import changeStatus from "./changeStatus";

const handleDeclinePost = async (dataToSend, setPosts) => {
  try {
    const data = await changeStatus(dataToSend);
    if (setPosts) {
      const id = dataToSend?.postID;
      if (data && data?.status === 200) {
        setPosts((prevPosts) => prevPosts.filter((post) => post?._id !== id));
      }
    }
  } catch {
    return;
  }
};

export default handleDeclinePost;
