import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate, daysUntil, parseTags } from "@/lib/utils";
import DealCard from "@/components/DealCard";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deal = await prisma.deal.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!deal) return { title: "Deal Not Found | ReferralHub" };
  return {
    title: `${deal.title} | ReferralHub`,
    description: deal.descriptionShort,
    openGraph: {
      title: deal.title,
      description: deal.descriptionShort,
      type: "article",
    },
  };
}

export default async function DealDetailPage({ params }: Props) {
  const deal = await prisma.deal.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!deal || deal.status === "draft") notFound();

  const relatedDeals = await prisma.deal.findMany({
    where: {
      categoryId: deal.categoryId,
      id: { not: deal.id },
      status: "active",
    },
    take: 3,
    include: { category: true },
  });

  const expDays = daysUntil(deal.expiresAt);
  const tags = parseTags(deal.tags);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.descriptionShort,
    brand: { "@type": "Brand", name: deal.storeName },
    offers: {
      "@type": "Offer",
      url: `/go/${deal.slug}`,
      priceCurrency: "USD",
      ...(deal.expiresAt && { validThrough: new Date(deal.expiresAt).toISOString() }),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-earth-400 mb-6">
          <a href="/" className="hover:text-earth-600">Deals</a>
          <span>/</span>
          <a href={`/category/${deal.category.slug}`} className="hover:text-earth-600">{deal.category.name}</a>
          <span>/</span>
          <span className="text-earth-600">{deal.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{deal.imageEmoji}</span>
              <div>
                <h1 className="font-serif text-hero font-bold text-earth-900 leading-tight">
                  {deal.title}
                </h1>
                <p className="text-sm uppercase tracking-wider text-earth-400 mt-2">
                  {deal.storeName} &middot; {deal.category.name}
                </p>
              </div>
            </div>

            {/* Editorial Description */}
            <div className="prose prose-earth max-w-none mb-8">
              {deal.descriptionLong?.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-earth-700 leading-relaxed text-[16px] mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* How It Works */}
            <div className="bg-cream-100 rounded-xl p-6 mb-8">
              <h3 className="font-serif text-lg font-bold text-earth-900 mb-3">How This Referral Works</h3>
              <div className="space-y-2 text-sm text-earth-600">
                <p>1. Click the &quot;Get This Deal&quot; button below to visit {deal.storeName}.</p>
                <p>2. {deal.creditValueUser > 0 ? `You receive ${deal.creditType?.split(",")[0] || "a special offer"}.` : "Complete your purchase through the referral link."}</p>
                <p>3. I receive a small credit or commission — at no extra cost to you.</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={`/go/${deal.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 text-center"
              >
                Get This Deal &rarr;
              </a>
              <ShareButtons title={deal.title} slug={deal.slug} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Deal Meta */}
            <div className="bg-white rounded-xl border border-earth-100 p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-earth-400">Deal Details</h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-earth-500">Store</span>
                  <span className="font-medium text-earth-800">{deal.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-500">Category</span>
                  <span className="font-medium text-earth-800">{deal.category.name}</span>
                </div>
                {deal.creditType && (
                  <div className="flex justify-between">
                    <span className="text-earth-500">Credit</span>
                    <span className="font-medium text-olive-700">{deal.creditType}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-earth-500">Added</span>
                  <span className="font-medium text-earth-800">{formatDate(deal.dateAdded)}</span>
                </div>
                {deal.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-earth-500">Expires</span>
                    <span className={`font-medium ${expDays && expDays <= 3 ? "text-red-600" : expDays && expDays <= 14 ? "text-amber-600" : "text-earth-800"}`}>
                      {formatDate(deal.expiresAt)}
                      {expDays !== null && expDays > 0 && ` (${expDays}d)`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-earth-500">Clicks</span>
                  <span className="font-medium text-earth-800">{deal.clickCount}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-xl border border-earth-100 p-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-earth-400 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-earth-50 px-3 py-1 rounded-full text-xs text-earth-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FTC Disclosure */}
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Disclosure:</strong> This page contains a referral link. When you use this link, I may earn a commission or credit at no additional cost to you.
              </p>
            </div>
          </aside>
        </div>

        {/* Related Deals */}
        {relatedDeals.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-heading font-bold text-earth-900 mb-6">Related Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDeals.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
