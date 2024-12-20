import dynamic from "next/dynamic";
const SignUpForm = dynamic(() => import("./SignUpForm"));
export const metadata = {
  title: "Signup - Ruqyah Forum",
  description: "Join Ruqyah Forum to access exclusive content and community discussions.",
  keywords: ["signup", "registration", "Ruqyah Forum", "community", "ruqyahbd"],
  other: {
    "twitter:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
    "twitter:card": "summary_large_image",
    "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/signup`,
    "og:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
  },
  image: "https://i.ibb.co/TKJFzG3/join-page.jpg",
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