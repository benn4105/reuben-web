import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SimulatorLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-white/5" />
            <Skeleton className="h-10 w-72 bg-white/5" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-lg bg-white/5" />
            <Skeleton className="h-10 w-40 rounded-lg bg-white/5" />
          </div>
        </div>

        {/* Description */}
        <Skeleton className="h-5 w-[600px] bg-white/5 mb-2" />
        <Skeleton className="h-5 w-[500px] bg-white/5 mb-8" />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-24 bg-white/5" />
                <Skeleton className="h-8 w-16 bg-white/5" />
                <Skeleton className="h-3 w-32 bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start Here Cards */}
        <Skeleton className="h-6 w-40 bg-white/5 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-6 rounded bg-white/5" />
                <Skeleton className="h-5 w-28 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-3/4 bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simulation History */}
        <Skeleton className="h-6 w-48 bg-white/5 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg bg-white/5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48 bg-white/5" />
                  <Skeleton className="h-3 w-32 bg-white/5" />
                </div>
                <Skeleton className="h-8 w-20 rounded bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
