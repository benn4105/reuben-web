import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Reuben Blog & Changelog",
  description: "Updates on Reux, PLOS, and the Reuben ecosystem.",
};

const posts = [
  {
    slug: "reux-prototype-complete",
    title: "Reux Public Prototype Complete",
    date: "2026-05-01",
    excerpt: "Today we're opening up the Business Simulator, a live demonstration of the Reux engine forecasting margins and risk.",
    category: "Changelog",
  },
  {
    slug: "why-we-are-building-reux",
    title: "Why We're Building a New Language for Operations",
    date: "2026-04-15",
    excerpt: "Most web applications struggle with complex business rules. Here's why we think a specialized backend language is the answer.",
    category: "Engineering",
  }
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen relative">
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#8A2BE2] rounded-full blur-[200px] mix-blend-screen opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Blog & Updates
          </h1>
          <p className="text-xl text-gray-400">
            The latest news from the Reuben team.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <Card className="group-hover:border-white/20 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="bg-[#00F0FF]/10 border-[#00F0FF]/20 text-[#00F0FF]">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-[#00F0FF] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
