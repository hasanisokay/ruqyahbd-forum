import LoginForm from "./LoginForm";
export const metadata = {
    title: "Login - Ruqyah Forum",
    description: "Login to the Ruqyah Forum by Ruqyah Support BD. Access your account, engage with the community, and participate in discussions on spiritual well-being.",
    keywords: ["login", "Ruqyah Forum", "community", "spiritual well-being"],
    author: "Ruqyah Support BD",
    other: {
        "theme-color": { dark: "#8a8080", light: "#555" },
        "color-scheme": ["dark", "light"],
        "twitter:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
        "twitter:card": "summary_large_image",
        "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/login`,
        "og:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
        "og:type": "website",
      },
      image: "https://i.ibb.co/TKJFzG3/join-page.jpg",
      url: `${process.env.NEXT_PUBLIC_BASEURL}/login`,
  };

const page = () => {
    return (
        <>
            <LoginForm />
        </>
    );
};

export default page;