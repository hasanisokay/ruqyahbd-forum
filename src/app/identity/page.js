'use server'
import ForgetPass from "@/components/ForgetPass";

export async function generateMetadata() {
  return {
    title: "Forgot Password - Ruqyah Forum",
    description: "Recover your account password for Ruqyah Forum by Ruqyah Support BD. Follow the steps to reset your password and regain access to your account.",
    keywords: ["forgot password", "password recovery", "Ruqyah Forum", "account"],
     other: {
      "theme-color": { dark: "#8a8080", light: "#555" },
      "color-scheme": ["dark", "light"],
      "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/identity`,
      "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
      "og:type": "website",
    },
    image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    url: `${process.env.NEXT_PUBLIC_BASEURL}/identity`,  };
}
const page = () => {
    return (
        <>
          <ForgetPass />  
        </>
    );
};

export default page;