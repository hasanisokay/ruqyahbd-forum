import getPost from "@/utils/getPost";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LoadingCards from "@/components/LoadingCards";
import { unstable_noStore } from "next/cache";
import dynamic from "next/dynamic";
const SinglePostInHomePage = dynamic(() => import('@/components/SinglePostInHomePage'));
export async function generateMetadata({ params }) {
  const postID = params?.id || null;
  let id = postID;
  let post
  if(id){
    post = await getPost(id);
  }
  return {
    title: (post?.authorInfo?.name || "Not Found") + " - " + "Ruqyah Forum",
    description:
      post?.post ||
      "Explore a post on Ruqyah Forum. Engage with the community, share your thoughts, and stay informed on spiritual well-being topics.",
    keywords: ["post", "Ruqyah Forum", "community", "spiritual well-being"],
    author: "Ruqyah Support BD",
    other: {
      "theme-color": { dark: "#8a8080", light: "#555" },
      "color-scheme": ["dark", "light"],
      "twitter:image":
        post?.photos?.length > 0
          ? post?.photos[0]
          : process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/${id}`,
      "og:image":
        post?.photos?.length > 0
          ? post?.photos[0]
          : process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "og:type": "website",
    },
    url: `${process.env.NEXT_PUBLIC_BASEURL}/${id}`,
    image:
      [
        ...post?.photos,
        "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
      ] ||
      "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  };
}

export default async function singlePost({ params }) {
  unstable_noStore();
  const postID = params?.id;
  let id = postID;
  let post 
  if(id){
    post = await getPost(id);
  }
  if (
    post?.status === 500 ||
    post?.status === 400 ||
    post?.status === 404 ||
    !post ||
    post?.error
  )
    return notFound();
  return (
    <div>
      <Suspense fallback={<LoadingCards />}>
        <SinglePostInHomePage fetchedPost={post} />
      </Suspense>
    </div>
  );
}
