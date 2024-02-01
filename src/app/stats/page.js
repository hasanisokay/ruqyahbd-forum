import Stats from "@/components/stats/Stats";
export const metadata = {
  title: "Stats - Ruqyah Forum",
  description:
    "Learn more about Ruqyah Forum, a community platform supported by Ruqyah Support BD. Discover our mission, values, and how you can actively participate in the forum.",
  keywords: [
    "about us",
    "stats",
    "statistics",
    "Ruqyah Forum",
    "community",
    "mission",
    "values",
  ],
  other: {
    "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    "twitter:card": "summary_large_image",
    "og-url":  `${process.env.NEXT_PUBLIC_BASEURL}/stats`,
    "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
  },
  image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
  url: `${process.env.NEXT_PUBLIC_BASEURL}/stats`,
};

const statsPage = async () => {

  return (
    <div>
      <Stats/>
    </div>
  );
};

export default statsPage;
