import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Reuben | Engineering the Future of Systems",
  description: "Reuben builds powerful, structurally sound tools for modern computing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.variable} font-sans min-h-full flex flex-col bg-[#0A0A0A] text-[#ededed]`}>
        <Navbar />
        <main className="flex-grow flex flex-col relative z-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
