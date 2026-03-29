import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DealCard from "@/components/DealCard";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: "Category Not Found | Bewitched Bashes" };
  return {
    title: `${category.name} Deals | Bewitched Bashes`,
    description: category.description || `Browse ${category.name} party supply deals`,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-witch-500 mb-6">
        <Link href="/" className="hover:text-gold-400">Home</Link><span>/</span>
        <Link href="/deals" className="hover:text-gold-400">Deals</Link><span>/</span>
        <span className="text-witch-300">{category.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{category.iconEmoji}</span>
        <h1 className="font-serif text-hero font-bold text-gold-400">{category.name}</h1>
      </div>
      {category.description && <p className="text-witch-300 text-lg max-w-2xl mb-8">{category.description}</p>}

      {deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => <DealCard key={deal.id} deal={deal} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-witch-500"><p>No deals in this category yet.</p></div>
      )}
    </div>
  );
}
