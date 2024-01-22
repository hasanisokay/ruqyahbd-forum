"use server";
import HomePagePosts from "@/components/HomeSecttion/HomePagePosts";
import NewPostSection from "@/components/HomeSecttion/NewPostSection";
import LoadingCards from "@/components/LoadingCards";
import getPosts from "@/utils/getPosts";
import { unstable_noStore } from "next/cache";
import { Suspense } from "react";

const HomePage = async () => {
  unstable_noStore()
  const posts = await getPosts(1);
  return (
    <div>
      <NewPostSection />
      <Suspense fallback={<LoadingCards/>} >
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
      </Suspense>
    </div>
  );
};

export default HomePage;
