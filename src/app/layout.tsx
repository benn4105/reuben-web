import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Reuben | Engineering the Future of Systems",
  description: "Reuben builds data-aware tools for backend systems, simulation products, and developer infrastructure. Powered by the Reux prototype engine.",
  openGraph: {
    title: "Reuben | Engineering the Future of Systems",
    description: "Reuben builds data-aware tools for backend systems, simulation products, and developer infrastructure. Powered by the Reux prototype engine.",
    url: "https://reuben.inc",
    siteName: "Reuben",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben | Engineering the Future of Systems",
    description: "Reuben builds data-aware tools for backend systems, simulation products, and developer infrastructure.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark h-full antialiased", geistSans.variable, geistMono.variable)}>
      <body className="font-sans min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
