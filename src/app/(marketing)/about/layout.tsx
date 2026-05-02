import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Reuben | Our Story",
  description: "Learn about Reuben's mission to engineer the future of systems.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
