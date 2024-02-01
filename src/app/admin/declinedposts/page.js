'use server'
import DeclinedPosts from "@/components/admin/DeclinedPosts";

export async function generateMetadata() {
  return {
    title: "Declined Posts - Ruqyah Forum",
    description: "Manage and oversee the declined posts as an administrator. Access powerful tools, monitor community activities, and ensure the smooth functioning of the forum.",
    keywords: ["admin", "Ruqyah Forum", "community management", "administrator","admin-activity"],
    other: {
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/admin/declined-posts`,
    },
    url: `${process.env.NEXT_PUBLIC_BASEURL}/admin/declined-posts`,
}}


const declinedPostsPage = () => {
    return (
        <>
            <DeclinedPosts/>
        </>
    );
};

export default declinedPostsPage;