import dynamic from "next/dynamic";

const Profile = dynamic(() => import("./Profile"));
export const metadata = {
  title: "Profile | Ruqyah Forum",
  description:
    "Explore and manage your profile on Ruqyah Forum. Engage with the community and stay connected.",
  keywords: [
    "profile",
    "Ruqyah Forum",
    "community",
    "user account",
    "ruqyahbd",
  ],
  other: {
    "twitter:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
    "twitter:card": "summary_large_image",
    "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/login`,
    "og:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
  },
  image: "https://i.ibb.co/TKJFzG3/join-page.jpg",
  url: `${process.env.NEXT_PUBLIC_BASEURL}/login`,
};
const ProfilePage = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default ProfilePage;
