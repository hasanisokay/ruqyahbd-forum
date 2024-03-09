import "./globals.css";
import Toaster from "@/components/Toaster";
import Navbar from "@/components/shared/Navbar";
import Providers from "@/providers/Providers";
export const metadata = {
  title: "Ruqyah Forum",
  description:
    "Join the Ruqyah Forum, a vibrant community powered by Ruqyah Support BD. Engage in meaningful discussions, stay informed with the latest updates, and connect with like-minded individuals on topics related to Ruqyah and spiritual well-being.",
  publisher: "Ruqyah Support BD",
  authors: [
    { name: "Ruqyah Support BD", url: "https://ruqyahbd.org" },
    {
      name: "Ruqyah Support Group",
      url: "https://www.facebook.com/groups/ruqyahbd",
    },
  ],
  keywords: [
    "Ruqyah Forum",
    "community",
    "ruqyahbd",
    "Ruqyah Support BD Forum",
    "Ruqyah Support Bangladesh",
  ],
  other: {
    "color-scheme": ["dark", "light"],
    "twitter:image": "https://i.ibb.co/89yqcW8/home-page.jpg",
    "twitter:card": "summary_large_image",
    "og-url": process.env.NEXT_PUBLIC_BASEURL,
    "og:image": "https://i.ibb.co/89yqcW8/home-page.jpg",
    "og:type": "website",
    locale: "en_US",
  },
  image: "https://i.ibb.co/89yqcW8/home-page.jpg",
  url: process.env.NEXT_PUBLIC_BASEURL,
};

export const viewport = {
  width: 'device-width',
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#8a8080" },
    { media: "(prefers-color-scheme: light)", color: "#555" },
  ],
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" data-theme={"dark"} className="transition-all">
      <body>
        <Providers>
          <Navbar></Navbar>
          <main>{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
};
export default RootLayout;
