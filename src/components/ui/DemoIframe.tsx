"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface DemoIframeProps {
  src: string;
}

export default function DemoIframe({ src }: DemoIframeProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/40 sm:min-h-[680px]">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0A0A0A]">
          <Loader2 className="h-10 w-10 text-[#00F0FF] animate-spin mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Loading live Reux demo...</h3>
          <p className="text-gray-400 text-sm max-w-sm text-center">
            The hosted service can take a few seconds to wake up.
          </p>
        </div>
      )}
      
      <iframe
        src={src}
        title="Reux pilot demo"
        className="absolute inset-0 h-full w-full bg-white z-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="clipboard-write"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
