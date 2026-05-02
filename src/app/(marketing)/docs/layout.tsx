import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reux Developer Preview | Reuben",
  description: "Explore the Reux language prototype. Learn how the business logic engine powers the simulator and view syntax examples.",
  openGraph: {
    title: "Reux Developer Preview | Reuben",
    description: "Explore the Reux language prototype. Learn how the business logic engine powers the simulator and view syntax examples.",
    url: "https://reuben.inc/docs",
    siteName: "Reuben",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reux Developer Preview",
    description: "Explore the Reux language prototype and syntax.",
    images: ["/og-image.jpg"],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
