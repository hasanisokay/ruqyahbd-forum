'use server'
import PublicNotice from "@/components/PublicNotice";

export async function generateMetadata() {
  return {
    title: "Public Notice - Ruqyah Forum",
    description:
      "Stay informed with the latest public notices from Ruqyah Forum. Find important updates, announcements, and community news to enhance your participation in the forum.",
    keywords: ["notice", "Ruqyah Forum", "community", "spiritual well-being"],
    other: {
      "twitter:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/login`,
      "og:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
    },
    image: "https://i.ibb.co/TKJFzG3/join-page.jpg",
    url: `${process.env.NEXT_PUBLIC_BASEURL}/login`,
  };
}

const NoticePage = () => {
  return (
    <div>
      <PublicNotice />
    </div>
  );
};

export default NoticePage;
