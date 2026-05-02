import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Reuben",
  description: "Explore the Reuben ecosystem: the Business Simulator, the Reux language, and our planned PLOS product.",
  openGraph: {
    title: "Projects | Reuben",
    description: "Explore the Reuben ecosystem: the Business Simulator, the Reux language, and our planned PLOS product.",
    url: "https://reuben.inc/projects",
    siteName: "Reuben",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Reuben",
    description: "Explore the Reuben ecosystem: the Business Simulator, the Reux language, and our planned PLOS product.",
    images: ["/og-image.jpg"],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
