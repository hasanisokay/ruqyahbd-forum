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
      "twitter:image": "https://i.ibb.co/wMNWD0s/donate-page.jpg",
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/donate`,
      "og:image": "https://i.ibb.co/wMNWD0s/donate-page.jpg",
      "og:type": "website",
    },
    image: "https://i.ibb.co/wMNWD0s/donate-page.jpg",
    url: `${process.env.NEXT_PUBLIC_BASEURL}/donate`,
  };
}

const donatePage = () => {
  return (
    <>
      {/* <Donate /> */}
    <p className="text-xl text-center">Coming soon...</p>
    </>
  );
};

export default donatePage;
