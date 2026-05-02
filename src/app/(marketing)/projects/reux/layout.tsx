import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reux | The Data-Aware Backend Language",
  description: "Reux is a prototype programming language built for data models, state changes, workflows, forecasts, and decision rules.",
};

export default function ReuxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
