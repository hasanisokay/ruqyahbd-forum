const handleToggleExpand = ( setExpandedPosts, postID ) => {
  return setExpandedPosts((prevExpandedPosts) => {
    if (prevExpandedPosts.includes(postID)) {
      // Post is expanded, so collapse it
      return prevExpandedPosts.filter((id) => id !== postID);
    } else {
      // Post is collapsed, so expand it
      return [...prevExpandedPosts, postID];
    }
  });
};

export default handleToggleExpand;
