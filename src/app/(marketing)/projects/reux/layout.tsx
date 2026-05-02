import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reux Language | Reuben",
  description: "A declarative simulation and business logic language. Built for high-stakes decision making.",
  openGraph: {
    title: "Reux Language | Reuben",
    description: "A declarative simulation and business logic language. Built for high-stakes decision making.",
    url: "https://reuben.inc/projects/reux",
    siteName: "Reuben",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reux Language | Reuben",
    description: "A declarative simulation and business logic language.",
    images: ["/og-image.jpg"],
  },
};

export default function ReuxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
