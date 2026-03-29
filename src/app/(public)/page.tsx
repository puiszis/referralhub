import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import DealCard from "@/components/DealCard";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bewitched Bashes — Spellbinding Party Planning & Curated Supplies",
  description: "Enchanting party ideas, themed decorations, and curated supply links to make every bash unforgettable.",
};

export default async function HomePage() {
  const [posts, featuredDeals, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    prisma.deal.findMany({
      where: { status: "active", featured: true },
      include: { category: true },
      take: 6,
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <span className="text-5xl mb-4 block">🔮</span>
        <h1 className="font-serif text-hero font-bold text-gold-400 mb-4">
          Bewitched Bashes
        </h1>
        <p className="text-witch-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Spellbinding party planning ideas, themed decoration guides, and hand-picked supply links
          to make every celebration absolutely enchanting.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/blog" className="btn-primary">Read the Blog</Link>
          <Link href="/deals" className="btn-secondary">Browse Deals</Link>
        </div>
      </section>

      {/* Category Quick Nav */}
      {categories.length > 0 && (
        <section className="mb-16">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="category-pill">
                <span>{cat.iconEmoji}</span> {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-heading font-bold text-witch-100">Latest Party Guides</h2>
            <Link href="/blog" className="btn-ghost text-sm">View all &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Deals */}
      {featuredDeals.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-heading font-bold text-witch-100">Featured Deals</h2>
            <Link href="/deals" className="btn-ghost text-sm">All deals &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="mb-16">
        <NewsletterForm />
      </section>
    </div>
  );
}
