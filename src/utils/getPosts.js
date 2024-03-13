'use server'
const getPosts = async (pageIndex) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASEURL}/api/posts?page=${pageIndex}`
    const response = await fetch(apiUrl, {cache:'no-cache'});
    const post = await response.json();
    return post;
  } catch {
    const post = { status: 404, message: "Server side error occurs." };
    return post;
  }
};

export default getPosts;
