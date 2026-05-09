import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function NewSimulationLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <Skeleton className="h-4 w-32 bg-white/5" />
          <Skeleton className="h-10 w-56 bg-white/5" />
          <Skeleton className="h-5 w-[500px] bg-white/5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Template Picker */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-32 bg-white/5" />
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg bg-white/5" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scenario Tabs */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-9 w-24 rounded-lg bg-white/5" />
              <Skeleton className="h-9 w-24 rounded-lg bg-white/5" />
              <Skeleton className="h-9 w-10 rounded-lg bg-white/5" />
            </div>

            {/* Input Fields */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-48 bg-white/5" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-white/5" />
                      <Skeleton className="h-10 rounded-lg bg-white/5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sliders */}
            <Card className="border-white/5 bg-white/[0.02]">
              <CardContent className="p-6 space-y-6">
                <Skeleton className="h-5 w-40 bg-white/5" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32 bg-white/5" />
                      <Skeleton className="h-4 w-10 bg-white/5" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full bg-white/5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Run Button */}
            <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
          </div>

          {/* Right Column - Code Preview */}
          <Card className="border-white/5 bg-white/[0.02] h-fit sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40 bg-white/5" />
                <Skeleton className="h-8 w-16 rounded bg-white/5" />
              </div>
              <Skeleton className="h-4 w-full bg-white/5" />
              <div className="space-y-2 pt-4">
                {[82, 95, 68, 90, 45, 72, 88, 60, 75, 93, 55, 85, 70, 80, 48, 92, 63, 78, 50, 87].map((w, i) => (
                  <Skeleton
                    key={i}
                    className="h-4 bg-white/5"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
