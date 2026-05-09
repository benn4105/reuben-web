import AnimatedButton from "@/components/ui/AnimatedButton";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#0A0A0A]">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#8A2BE2] rounded-full blur-[200px] mix-blend-screen opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[#00F0FF] rounded-full blur-[200px] mix-blend-screen opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center px-4">
        <div className="mb-8">
          <span className="text-[120px] md:text-[180px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 leading-none select-none">
            404
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page not found
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AnimatedButton href="/" variant="primary">
            Go Home
          </AnimatedButton>
          <AnimatedButton href="/simulator" variant="secondary">
            Try the Simulator
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
