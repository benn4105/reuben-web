import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SimulationResultLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-white/5" />
            <Skeleton className="h-10 w-64 bg-white/5" />
            <Skeleton className="h-5 w-96 bg-white/5" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36 rounded-lg bg-white/5" />
            <Skeleton className="h-10 w-28 rounded-lg bg-white/5" />
          </div>
        </div>

        {/* Recommendation Panel */}
        <Card className="border-white/5 bg-white/[0.02] mb-8">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
              <Skeleton className="h-6 w-48 bg-white/5" />
            </div>
            <Skeleton className="h-5 w-full bg-white/5" />
            <Skeleton className="h-5 w-3/4 bg-white/5" />
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-white/5" />
                  <Skeleton className="h-8 w-24 bg-white/5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-4 w-20 bg-white/5" />
                <Skeleton className="h-8 w-16 bg-white/5" />
                <Skeleton className="h-3 w-28 bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((i) => (
            <Card key={i} className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-32 bg-white/5" />
                <Skeleton className="h-64 w-full rounded-lg bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-48 bg-white/5" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-white/5 rounded" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full bg-white/5 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
