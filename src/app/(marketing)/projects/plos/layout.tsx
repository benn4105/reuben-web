import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PLOS | Personal Life Operating System",
  description: "PLOS is a planned future product that uses Reux to manage personal data, workflows, and life simulations.",
};

export default function PlosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
