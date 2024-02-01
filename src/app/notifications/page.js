
import Notifications from './Notifications';

export const metadata = {
    title: "Notifications | Ruqyah Forum",
    description: "Stay informed with the latest notifications from Ruqyah Forum. Keep up-to-date with community activities and updates.",
    keywords: ["notifications", "Ruqyah Forum", "community", "updates", "ruqyahbd"],
    other: {
        "twitter:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
        "twitter:card": "summary_large_image",
        "og-url": `${process.env.NEXT_PUBLIC_BASEURL}/login`,
        "og:image": "https://i.ibb.co/TKJFzG3/join-page.jpg",
        "og:type": "website",
      },
      image: "https://i.ibb.co/TKJFzG3/join-page.jpg",
      url: `${process.env.NEXT_PUBLIC_BASEURL}/login`,
  };

const notificationsPage = () => {
    return (
        <div>
            <Notifications/>
        </div>
    );
};

export default notificationsPage;