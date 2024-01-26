import dynamic from "next/dynamic";
const SignUpForm = dynamic(() => import("./SignUpForm"));
export const metadata = {
  title: "Signup - Ruqyah Forum",
  description: "Join Ruqyah Forum to access exclusive content and community discussions.",
  keywords: ["signup", "registration", "Ruqyah Forum", "community", "ruqyahbd"],
  author: "Ruqyah Support BD", 
  other: {
    "theme-color": { dark: "#8a8080", light: "#555" },
    "color-scheme": ["dark", "light"],
    "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    "twitter:card": "summary_large_image",
    "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/signup`,
    "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    "og:type": "website",
  },
  image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
  url: `${process.env.NEXT_PUBLIC_BASEURL}/signup`,
};

const SignupPage = () => {
  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default SignupPage;