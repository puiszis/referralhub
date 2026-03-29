import Link from "next/link";
import { daysUntil, parseTags } from "@/lib/utils";

interface DealCardProps {
  deal: {
    slug: string;
    title: string;
    storeName: string;
    descriptionShort: string;
    imageEmoji: string;
    creditType: string | null;
    creditValueUser: number;
    tags: string;
    featured: boolean;
    expiresAt: Date | string | null;
    clickCount: number;
    category: { name: string; slug: string };
  };
}

export default function DealCard({ deal }: DealCardProps) {
  const expDays = daysUntil(deal.expiresAt);
  const tags = parseTags(deal.tags);

  return (
    <Link href={`/deals/${deal.slug}`} className="deal-card flex flex-col h-full group">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl" role="img" aria-label={deal.storeName}>{deal.imageEmoji}</span>
          <div className="flex items-center gap-2">
            {deal.featured && (
              <span className="badge-green">Featured</span>
            )}
            {expDays !== null && expDays <= 14 && expDays > 0 && (
              <span className={expDays <= 3 ? "badge-red" : "badge-amber"}>
                {expDays}d left
              </span>
            )}
          </div>
        </div>

        <h3 className="font-serif text-lg font-bold text-earth-900 mb-1 group-hover:text-olive-700 transition-colors leading-snug">
          {deal.title}
        </h3>

        <p className="text-xs font-medium uppercase tracking-wider text-earth-400 mb-2">
          {deal.storeName} &middot; {deal.category.name}
        </p>

        <p className="text-sm text-earth-600 leading-relaxed mb-4 flex-1">
          {deal.descriptionShort}
        </p>

        {deal.creditType && (
          <div className="bg-olive-50 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs font-semibold text-olive-700">{deal.creditType}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-earth-400">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-earth-50 px-2 py-0.5 rounded text-earth-500">
                {tag}
              </span>
            ))}
          </div>
          <span>{deal.clickCount} clicks</span>
        </div>
      </div>
    </Link>
  );
}
