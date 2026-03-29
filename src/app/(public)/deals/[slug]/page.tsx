import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, daysUntil, parseTags } from "@/lib/utils";
import DealCard from "@/components/DealCard";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deal = await prisma.deal.findUnique({ where: { slug: params.slug }, include: { category: true } });
  if (!deal) return { title: "Deal Not Found | Bewitched Bashes" };
  return {
    title: `${deal.title} | Bewitched Bashes`,
    description: deal.descriptionShort,
    openGraph: { title: deal.title, description: deal.descriptionShort, type: "article" },
  };
}

export default async function DealDetailPage({ params }: Props) {
  const deal = await prisma.deal.findUnique({ where: { slug: params.slug }, include: { category: true } });
  if (!deal || deal.status === "draft") notFound();

  const relatedDeals = await prisma.deal.findMany({
    where: { categoryId: deal.categoryId, id: { not: deal.id }, status: "active" },
    take: 3, include: { category: true },
  });

  const expDays = daysUntil(deal.expiresAt);
  const tags = parseTags(deal.tags);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product",
    name: deal.title, description: deal.descriptionShort,
    brand: { "@type": "Brand", name: deal.storeName },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXTAUTH_URL || "https://bewitchedbashes.com"}/go/${deal.slug}`,
      priceCurrency: "USD", availability: "https://schema.org/InStock",
      ...(deal.expiresAt && { validThrough: new Date(deal.expiresAt).toISOString() }),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-witch-500 mb-6">
          <Link href="/" className="hover:text-gold-400">Home</Link><span>/</span>
          <Link href="/deals" className="hover:text-gold-400">Deals</Link><span>/</span>
          <Link href={`/category/${deal.category.slug}`} className="hover:text-gold-400">{deal.category.name}</Link><span>/</span>
          <span className="text-witch-300">{deal.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{deal.imageEmoji}</span>
              <div>
                <h1 className="font-serif text-hero font-bold text-witch-100 leading-tight">{deal.title}</h1>
                <p className="text-sm uppercase tracking-wider text-witch-500 mt-2">{deal.storeName} &middot; {deal.category.name}</p>
              </div>
            </div>

            <div className="max-w-none mb-8 space-y-4">
              {deal.descriptionLong?.split("\n\n").map((p, i) => (
                <p key={i} className="text-witch-300 leading-relaxed">{p}</p>
              ))}
            </div>

            <div className="glass-panel p-6 mb-8">
              <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">How This Referral Works</h3>
              <div className="space-y-2 text-sm text-witch-300">
                <p>1. Click the &quot;Get This Deal&quot; button to visit {deal.storeName}.</p>
                <p>2. {deal.creditValueUser > 0 ? `You receive ${deal.creditType?.split(",")[0] || "a special offer"}.` : "Shop through our referral link."}</p>
                <p>3. We receive a small commission — at no extra cost to you.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href={`/go/${deal.slug}`} target="_blank" rel="noopener noreferrer" className="btn-primary text-lg px-8 py-4 text-center">
                Get This Deal &rarr;
              </a>
              <ShareButtons title={deal.title} slug={`deals/${deal.slug}`} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="glass-panel p-5 space-y-4">
              <h4 className="section-label">Deal Details</h4>
              <div className="space-y-3 text-sm">
                {[
                  ["Store", deal.storeName],
                  ["Category", deal.category.name],
                  ...(deal.creditType ? [["Credit", deal.creditType]] : []),
                  ["Added", formatDate(deal.dateAdded)],
                  ...(deal.expiresAt ? [["Expires", `${formatDate(deal.expiresAt)}${expDays && expDays > 0 ? ` (${expDays}d)` : ""}`]] : []),
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between">
                    <span className="text-witch-500">{label}</span>
                    <span className="font-medium text-witch-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {tags.length > 0 && (
              <div className="glass-panel p-5">
                <h4 className="section-label mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => <span key={tag} className="badge-witch text-[10px]">{tag}</span>)}
                </div>
              </div>
            )}

            <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4">
              <p className="text-xs text-gold-400/80 leading-relaxed">
                <strong>Disclosure:</strong> This page contains a referral link. When you use this link, we may earn a commission at no additional cost to you.
              </p>
            </div>
          </aside>
        </div>

        {relatedDeals.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-heading font-bold text-witch-100 mb-6">Related Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDeals.map((d) => <DealCard key={d.id} deal={d} />)}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
