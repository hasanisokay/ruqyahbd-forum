import NewNotice from "@/components/admin/NewNotice";

export const metadata = {
    title: "New Notice - Ruqyah Forum",
    description: "Manage and add new notices as an administrator. Access powerful tools, monitor community activities, and ensure the smooth functioning of the forum.",
    keywords: ["admin", "Ruqyah Forum", "community management", "administrator","notice"],
    other: {
      "theme-color": { dark: "#8a8080", light: "#555" },
      "color-scheme": ["dark", "light"],
      "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/admin/notice`,
      "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "og:type": "website",
    },
    image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    url: `${process.env.NEXT_PUBLIC_BASEURL}/admin/notice`,
  };


const noticePageForAdmin = () => {
    return (
        <div>
            <NewNotice/>
        </div>
    );
};

export default noticePageForAdmin;