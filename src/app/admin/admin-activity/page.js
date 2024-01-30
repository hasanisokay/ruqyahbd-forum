"use server"
import AdminActivity from "../../../components/admin/AdminActivity";

export async function generateMetadata() {
  return {
    title: "Admin Activity - Ruqyah Forum",
    description:
      "Manage and oversee the admin activiy as an administrator. Access powerful tools, monitor community activities, and ensure the smooth functioning of the forum.",
    keywords: [
      "admin",
      "Ruqyah Forum",
      "community management",
      "administrator",
      "admin-activity",
    ],
    other: {
      "theme-color": { dark: "#8a8080", light: "#555" },
      "color-scheme": ["dark", "light"],
      "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/admin/admin-activity`,
      "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "og:type": "website",
    },
    image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    url: `${process.env.NEXT_PUBLIC_BASEURL}/admin/admin-activity`,
  };
}

const AdminActivityPage = () => {
  return (
    <>
      <AdminActivity />
    </>
  );
};

export default AdminActivityPage;
