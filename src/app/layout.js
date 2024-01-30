import "./globals.css";
import Toaster from "@/components/Toaster";
import Navbar from "@/components/shared/Navbar";
import Providers from "@/providers/Providers";
import "react-loading-skeleton/dist/skeleton.css";
export const metadata = {
  title: "Ruqyah Forum",
  description:
    "Join the Ruqyah Forum, a vibrant community powered by Ruqyah Support BD. Engage in meaningful discussions, stay informed with the latest updates, and connect with like-minded individuals on topics related to Ruqyah and spiritual well-being.",
  author: "Ruqyah Support BD",
  keywords: [
    "Ruqyah Forum",
    "community",
    "ruqyahbd",
    "Ruqyah Support BD Forum",
    "Ruqyah Support Bangladesh",
  ],
  other: {
    "theme-color": { dark: "#8a8080", light: "#555" },
    "color-scheme": ["dark", "light"],
    "twitter:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    "twitter:card": "summary_large_image",
    "og-url": process.env.NEXT_PUBLIC_BASEURL,
    "og:image": process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
    "og:type": "website",
  },
  image: process.env.NEXT_PUBLIC_META_IMAGE_MAIN,
  url: process.env.NEXT_PUBLIC_BASEURL,
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" data-theme={"dark"} className="transition-all">
      <body>
        <Providers>
          <Navbar></Navbar>
          <main className="mt-5">{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
};
export default RootLayout;
