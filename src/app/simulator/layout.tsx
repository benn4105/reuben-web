import SimulatorShell from "@/components/simulator/SimulatorShell";

export const metadata = {
  title: "Simulator | Reux Business Simulator",
  description: "Model operational decisions before making them. Powered by Reux.",
};

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimulatorShell>{children}</SimulatorShell>;
}
