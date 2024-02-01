"use server";
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
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/admin/admin-activity`,
    },
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
