'use server'
import HomePagePosts from "@/components/HomeSecttion/HomePagePosts";
import NewPostSection from "@/components/HomeSecttion/NewPostSection";
import getPosts from "@/utils/getPosts";


const HomePage = async () => {
  const posts = await getPosts(1);
  return (
    <div>
     <NewPostSection />
      <div>
        {posts?.status === 400 || posts?.status === 404 ? (
          <div className="cardinhome">
            <p className="text-center">
              {posts?.message}. Please reload the page. If this presists reach
              us at{" "}
              <code className="font-semibold">ruqyahbdforum@gmail.com</code>
            </p>
          </div>
        ) : (
          <HomePagePosts tenPostsArray={posts} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
