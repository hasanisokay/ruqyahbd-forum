const handleShowLess = (setExpandedPosts, postID) => {
    return setExpandedPosts((prevExpandedPosts) => prevExpandedPosts.filter((id) => id !== postID));    
};

export default handleShowLess;