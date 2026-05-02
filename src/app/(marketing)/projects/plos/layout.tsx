import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PLOS (Personal Life Operating System) | Reuben",
  description: "A planned simulation product for personal decisions. Powered by the Reux language.",
  openGraph: {
    title: "PLOS (Personal Life Operating System) | Reuben",
    description: "A planned simulation product for personal decisions. Powered by the Reux language.",
    url: "https://reuben.inc/projects/plos",
    siteName: "Reuben",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PLOS | Reuben",
    description: "A planned simulation product for personal decisions.",
    images: ["/og-image.jpg"],
  },
};

export default function PlosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
