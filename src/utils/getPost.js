const getPost = async (id) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/posts/${id}`);
    const post = await response.json();
    return post[0];
  } catch {
    const post = { status: 500, message:"server side error occurs" };
    return post;
  }
};

export default getPost;
