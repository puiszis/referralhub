import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DealCard from "@/components/DealCard";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: "Category Not Found | ReferralHub" };
  return {
    title: `${category.name} Deals | ReferralHub`,
    description: category.description || `Browse ${category.name} deals on ReferralHub`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const deals = await prisma.deal.findMany({
    where: { categoryId: category.id, status: "active" },
    orderBy: { dateAdded: "desc" },
    include: { category: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-earth-400 mb-4">
          <a href="/" className="hover:text-earth-600">Deals</a>
          <span>/</span>
          <span className="text-earth-600">{category.name}</span>
        </nav>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{category.iconEmoji}</span>
          <h1 className="font-serif text-hero font-bold text-earth-900">{category.name} Deals</h1>
        </div>
        {category.description && (
          <p className="text-earth-500 text-lg max-w-2xl">{category.description}</p>
        )}
      </div>

      {deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-earth-400">
          <p className="text-lg">No deals in this category yet.</p>
        </div>
      )}
    </div>
  );
}
