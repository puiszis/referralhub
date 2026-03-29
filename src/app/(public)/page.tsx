import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import DealCard from "@/components/DealCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReferralHub — Hand-Picked Deals & Referral Links",
  description: "Curated referral deals from products I personally use. Outdoor gear, tech, home products, finance, and lifestyle.",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { q?: string; sort?: string; category?: string };
}

async function getDeals(searchParams: Props["searchParams"]) {
  const { q, sort, category } = searchParams;

  const where: Record<string, unknown> = { status: "active" };

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { storeName: { contains: q } },
      { descriptionShort: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  let orderBy: Record<string, string> = { dateAdded: "desc" };
  if (sort === "popular") orderBy = { clickCount: "desc" };
  else if (sort === "expiring") orderBy = { expiresAt: "asc" };
  else if (sort === "featured") orderBy = { featured: "desc" };

  return prisma.deal.findMany({
    where: where as never,
    orderBy,
    include: { category: true },
  });
}

export default async function HomePage({ searchParams }: Props) {
  const [deals, categories, totalDeals] = await Promise.all([
    getDeals(searchParams),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.deal.count({ where: { status: "active" } }),
  ]);

  const featuredDeals = deals.filter((d) => d.featured);
  const regularDeals = deals.filter((d) => !d.featured);
  const hasFilters = searchParams.q || searchParams.category || searchParams.sort;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      {!hasFilters && (
        <section className="text-center py-12 mb-8">
          <h1 className="font-serif text-hero font-bold text-earth-900 mb-4">
            Hand-picked deals from products I personally use
          </h1>
          <p className="text-earth-500 text-lg max-w-2xl mx-auto mb-6">
            Curated referral links for outdoor gear, tech, home products, finance, and lifestyle.
            Every deal on this site is something I&apos;ve personally vetted.
          </p>
          <div className="flex justify-center gap-6 text-sm text-earth-400">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-olive-600 text-lg">{totalDeals}</span> active deals
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-olive-600 text-lg">{categories.length}</span> categories
            </span>
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <Suspense fallback={null}>
        <SearchAndFilter categories={categories} />
      </Suspense>

      {/* Featured Deals */}
      {!hasFilters && featuredDeals.length > 0 && (
        <section className="mt-10 mb-12">
          <h2 className="font-serif text-heading font-bold text-earth-900 mb-6">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>
      )}

      {/* All Deals */}
      <section className="mt-10">
        <h2 className="font-serif text-heading font-bold text-earth-900 mb-6">
          {hasFilters ? `${deals.length} Deal${deals.length !== 1 ? "s" : ""} Found` : "All Deals"}
        </h2>
        {(hasFilters ? deals : regularDeals).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(hasFilters ? deals : regularDeals).map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-earth-400">
            <p className="text-lg">No deals found matching your search.</p>
            <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="mt-16">
        <NewsletterForm />
      </section>
    </div>
  );
}
