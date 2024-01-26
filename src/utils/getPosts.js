'use server'
const getPosts = async (pageIndex) => {
  try {
    let apiUrl;
    if (pageIndex === 1){
      apiUrl = `${process.env.NEXT_PUBLIC_BASEURL}/api/posts?page=${pageIndex}`
    }
    else {
      apiUrl = `/api/posts?page=${pageIndex}`
    };
    const response = await fetch(apiUrl, {cache:'no-store'});
    const post = await response.json();
    
    return post;
  } catch {
    const post = { status: 404, message: "Server side error occurs." };
    return post;
  }
};

export default getPosts;
