import SimulatorShell from "@/components/simulator/SimulatorShell";

export const metadata = {
  title: "Simulator | Reux Business Simulator",
  description: "Model operational decisions before making them. Powered by Reux.",
  openGraph: {
    title: "Simulator | Reux Business Simulator",
    description: "Model operational decisions before making them. Powered by Reux.",
    url: "https://reuben.inc/simulator",
    siteName: "Reuben",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulator | Reux Business Simulator",
    description: "Model operational decisions before making them. Powered by Reux.",
    images: ["/og-image.jpg"],
  },
};

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimulatorShell>{children}</SimulatorShell>;
}
