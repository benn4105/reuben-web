import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reux Developer Preview | Documentation",
  description: "Get started with Reux, the prototype backend language and runtime for data-aware products.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
