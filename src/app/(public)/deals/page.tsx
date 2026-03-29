import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import DealCard from "@/components/DealCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Party Supply Deals | Bewitched Bashes",
  description: "Curated referral deals on party supplies, decorations, tableware, and more.",
};

interface Props { searchParams: { q?: string; sort?: string; category?: string } }

export default async function DealsPage({ searchParams }: Props) {
  const { q, sort, category } = searchParams;

  const where: Record<string, unknown> = { status: "active" };
  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { storeName: { contains: q, mode: "insensitive" } },
      { descriptionShort: { contains: q, mode: "insensitive" } },
      { tags: { contains: q } },
    ];
  }

  const orderByMap: Record<string, Record<string, string>> = {
    newest: { dateAdded: "desc" },
    popular: { clickCount: "desc" },
    expiring: { expiresAt: "asc" },
    featured: { featured: "desc" },
  };

  const [deals, categories] = await Promise.all([
    prisma.deal.findMany({
      where: where as never,
      orderBy: orderByMap[sort || "newest"] || orderByMap.newest,
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-hero font-bold text-gold-400 mb-3">Party Supply Deals</h1>
        <p className="text-witch-300 max-w-xl">
          Hand-picked referral links for party decorations, tableware, costumes, and more.
        </p>
      </div>

      <Suspense fallback={null}>
        <SearchAndFilter categories={categories} basePath="/deals" />
      </Suspense>

      <div className="mt-8">
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-witch-500">
            <p className="text-lg">No deals found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
