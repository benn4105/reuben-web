import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col relative z-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
