import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Reuben | Engineering the Future of Systems",
  description: "Reuben is building the language and infrastructure for complex system simulations. Learn about our mission and the Reux ecosystem.",
  openGraph: {
    title: "About Reuben | Engineering the Future of Systems",
    description: "Reuben is building the language and infrastructure for complex system simulations. Learn about our mission and the Reux ecosystem.",
    url: "https://reuben.inc/about",
    siteName: "Reuben",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Reuben | Engineering the Future of Systems",
    description: "Reuben is building the language and infrastructure for complex system simulations.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
