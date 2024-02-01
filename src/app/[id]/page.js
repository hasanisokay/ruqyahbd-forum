'use server'
import getPost from "@/utils/getPost";
import { Suspense } from "react";
import SinglePostInHomePage from "@/components/SinglePostInHomePage";
import { LoadingCards } from "@/components/LoadingSkeletons/Loaders";

const notFoundPageMeta = (id) => {
  return {
    title: "Not Found" + " - " + "Ruqyah Forum",
    description:
      "Explore a post on Ruqyah Forum. Engage with the community, share your thoughts, and stay informed on spiritual well-being topics.",
    keywords: ["post", "Ruqyah Forum", "community", "spiritual well-being"],
    author: "Ruqyah Support BD",
    other: {
      "color-scheme": ["dark", "light"],
      "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/${id}`,
      "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "og:type": "website",
    },
    url: `${process.env.NEXT_PUBLIC_BASEURL}/${id}`,
  };
};

export async function generateMetadata({ params }) {
  const postID = params?.id || null;
  let id = postID;
  let post;
  try {
    if (id) {
      post = await getPost(id);
    }
  } catch (error) {
    post = null;
    return notFoundPageMeta(id);
  }
  if (
    post?.status === 500 ||
    post?.status === 400 ||
    post?.status === 404 ||
    !post ||
    post?.error
  ) {
    return notFoundPageMeta(id);
  }

  return {
    title: (post?.authorInfo?.name || "Not Found") + " - " + "Ruqyah Forum",
    description:
      post?.post ||
      "Explore a post on Ruqyah Forum. Engage with the community, share your thoughts, and stay informed on spiritual well-being topics.",
    keywords: ["post", "Ruqyah Forum", "community", "spiritual well-being"],
    other: {
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
    },
    url: `${process.env.NEXT_PUBLIC_BASEURL}/${id}`,
  };
}

export default async function page({ params }) {
  const postID = params?.id;
  let id = postID;
  let post;
  try {
    if (id) {
      post = await getPost(id);
    }
  } catch (error) {
    post = null;
  }
  if (
    post?.status === 500 ||
    post?.status === 400 ||
    post?.status === 404 ||
    !post ||
    post?.error
  )
    return (
      <div className="text-center text-xl">
        <h1 className="text-2xl">404</h1>
        <p>Oho! Not Found.</p>
      </div>
    );
  else
    return (
      <>
        <Suspense fallback={<LoadingCards />}>
          <SinglePostInHomePage fetchedPost={post} />
        </Suspense>
      </>
    );
}
