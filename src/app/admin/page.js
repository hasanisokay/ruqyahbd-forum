'use server'
import Dashboard from "@/components/admin/Dashboard";

export async function generateMetadata() {
  return {
    title: "Admin - Ruqyah Forum",
    description:
      "Manage and oversee the Ruqyah Forum as an administrator. Access powerful tools, monitor community activities, and ensure the smooth functioning of the forum.",
    keywords: [
      "admin",
      "Ruqyah Forum",
      "community management",
      "administrator",
    ],
    other: {
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/admin`,
    },
    url: `${process.env.NEXT_PUBLIC_BASEURL}/admin`,
  };
}

const page = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default page;
