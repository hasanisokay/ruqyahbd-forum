'use server'
import ForgetPass from "@/components/ForgetPass";

export async function generateMetadata() {
  return {
    title: "Forgot Password - Ruqyah Forum",
    description: "Recover your account password for Ruqyah Forum by Ruqyah Support BD. Follow the steps to reset your password and regain access to your account.",
    keywords: ["forgot password", "password recovery", "Ruqyah Forum", "account"],
     other: {
      "twitter:image": "https://i.ibb.co/s9FsvQJ/pass-recovery.jpg",
      "twitter:card": "summary_large_image",
      "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/identity`,
      "og:image": "https://i.ibb.co/s9FsvQJ/pass-recovery.jpg",
    },
    image: "https://i.ibb.co/s9FsvQJ/pass-recovery.jpg",
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