import PendingPost from "@/components/admin/PendingPost";

export const metadata = {
  title: "Pending Posts - Ruqyah Forum",
  description: "Manage and oversee the pending posts as an administrator. Access powerful tools, monitor community activities, and ensure the smooth functioning of the forum.",
  keywords: ["admin", "Ruqyah Forum", "community management", "administrator","pending-posts"],
  other: {
    "theme-color": { dark: "#8a8080", light: "#555" },
    "color-scheme": ["dark", "light"],
    "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    "twitter:card": "summary_large_image",
    "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/admin/pending-posts`,
    "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    "og:type": "website",
  },
  image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
  url: `${process.env.NEXT_PUBLIC_BASEURL}/admin/pending-posts`,
};



const pendingPosts = () => {
  
  return (
    <div>
      <PendingPost />
    </div>
  );
};

export default pendingPosts;
