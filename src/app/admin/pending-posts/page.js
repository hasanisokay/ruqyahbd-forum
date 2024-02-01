'use server'
import PendingPost from "@/components/admin/PendingPost";

export async function generateMetadata() {
  return {
    title: "Pending Posts - Ruqyah Forum",
    description: "Manage and oversee the pending posts as an administrator. Access powerful tools, monitor community activities, and ensure the smooth functioning of the forum.",
    keywords: ["admin", "Ruqyah Forum", "community management", "administrator","pending-posts"],
    other: {
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/admin/pending-posts`,
    },
    url: `${process.env.NEXT_PUBLIC_BASEURL}/admin/pending-posts`,
}}



const pendingPosts = () => {
  return (
    <>
      <PendingPost />
    </>
  );
};

export default pendingPosts;
