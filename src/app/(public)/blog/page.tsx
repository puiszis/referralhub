import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Party Planning Blog | Bewitched Bashes",
  description: "Enchanting guides, themed party ideas, and curated supply roundups.",
};

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-hero font-bold text-gold-400 mb-3">The Party Grimoire</h1>
        <p className="text-witch-300 max-w-xl mx-auto">
          Guides, inspiration, and curated supply lists for throwing unforgettable themed parties.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-witch-500">
          <span className="text-4xl block mb-4">📝</span>
          <p className="text-lg">Brewing up new content&hellip; check back soon!</p>
        </div>
      )}
    </div>
  );
}
