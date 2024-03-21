import toast from "react-hot-toast";

const handleHate = async (id, postAuthor) => {
    return toast.success("Disliking coming soon...")
    if (!fetchedUser) {
        return toast.error("Log in to react")
    }
    const dataToSend = {
        postID: id, action: "like", actionByUsername: fetchedUser?.username, postAuthor
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
            const updatedPosts = posts.map((post) => {
                if (post._id === id) {
                    if (post?.likes?.length > 0) {
                        post.likes = [...post.likes, fetchedUser?.username]
                    }
                    else {
                        post.likes = [fetchedUser?.username]
                    }
                }
                return post;
            });
            setPosts(updatedPosts)
        }
    } catch (error) {
        console.error("Error disliking post:", error);
    }
}
export default handleHate;