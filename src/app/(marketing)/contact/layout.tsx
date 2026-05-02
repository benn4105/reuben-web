import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Reuben",
  description: "Get in touch with the Reuben team for questions about Reux, PLOS, or enterprise simulation.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
