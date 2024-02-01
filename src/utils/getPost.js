const getPost = async (id) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/posts/${id}`, {cache:'no-store'});
    const post = await response.json();
    return post[0];
  } catch {
    return { status: 500, message:"server side error occurs" };
  }
};

export default getPost;
