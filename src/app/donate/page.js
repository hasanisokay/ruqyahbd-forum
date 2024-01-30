"use server"
import dynamic from "next/dynamic";
const Donate = dynamic(() => import("@/components/donate/Donate"));

export async function generateMetadata() {
  return {
    title: "Donate - Ruqyah Forum",
    description:
      "Support Ruqyah Forum by making a donation. Your contribution helps us continue our mission.",
    keywords: [
      "donate",
      "Ruqyah Forum",
      "contribution",
    ],
    other: {
      "theme-color": { dark: "#8a8080", light: "#555" },
      "color-scheme": ["dark", "light"],
      "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/donate`,
      "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "og:type": "website",
    },
    image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    url: `${process.env.NEXT_PUBLIC_BASEURL}/donate`,
  };
}

const donatePage = () => {
  return (
    <>
      <Donate />
    </>
  );
};

export default donatePage;
