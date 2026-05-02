import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const POSTS: Record<string, { title: string; date: string; category: string; content: React.ReactNode }> = {
  "reux-prototype-complete": {
    title: "Reux Public Prototype Complete",
    date: "2026-05-01",
    category: "Changelog",
    content: (
      <>
        <p>
          Today we are opening up the <strong>Business Simulator</strong>, a live demonstration of the Reux engine forecasting margins and risk based on operational inputs.
        </p>
        <p>
          Reux is a domain-specific programming language designed specifically for the complex logic that underpins data-aware products. Over the past few months, we have built a working compiler, CLI, and integration layer that allows Next.js frontend applications to seamlessly pass inputs into Reux and receive strongly-typed responses.
        </p>
        <p>
          Try the simulator today to see how we evaluate multiple scenarios, generate forecasts, and assign risk scores under the hood.
        </p>
      </>
    ),
  },
  "why-we-are-building-reux": {
    title: "Why We Are Building a New Language for Operations",
    date: "2026-04-15",
    category: "Engineering",
    content: (
      <>
        <p>
          Most web applications struggle with complex business rules. They start simple, but as requirements grow, state changes and decision logic become scattered across frontend components, API handlers, and database triggers.
        </p>
        <p>
          We believe there is a better way. By extracting this logic into Reux, a specialized backend language, we can provide built-in primitives for scenarios, forecasts, dimensions, and objectives.
        </p>
        <p>
          This ensures that the rules of the game are always auditable, testable, and separate from your presentation layer.
        </p>
      </>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug as keyof typeof POSTS];
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} | Reuben Blog` };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug as keyof typeof POSTS];

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 min-h-screen relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00F0FF] rounded-full blur-[200px] mix-blend-screen opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-3xl relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-1 rounded-sm">
                {post.category}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
