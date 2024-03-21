import toast from "react-hot-toast";

const handleUnHate = async (id) => {
    return toast.success("Disliking coming soon...")
    if (!fetchedUser) {
        return toast.error("Log in to react")
    }
    const dataToSend = {
        postID: id, action: "dislike", actionByUsername: fetchedUser?.username
    }
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        };

        const response = await fetch('/api/posts/reaction', requestOptions);
        const data = await response.json();

        if (data.status === 200) {
            // Update the likes array in the posts
            const updatedPosts = posts.map((post) => {
                if (post._id === id) {
                    // Remove fetchedUser.username from the likes array
                    post.likes = post.likes.filter((person) => person !== fetchedUser?.username);
                }
                return post;
            });

            // Update the state to trigger a re-render
            setPosts(updatedPosts);
        }
    } catch (error) {
        console.error("Error disliking post:", error);
    }
}
export default handleUnHate;