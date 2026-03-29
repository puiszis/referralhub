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
  compact?: boolean;
}

export default function DealCard({ deal, compact }: DealCardProps) {
  const expDays = daysUntil(deal.expiresAt);
  const tags = parseTags(deal.tags);

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-4 bg-witch-900/50 rounded-xl border border-witch-700/30 hover:border-gold-500/40 transition-colors group">
        <span className="text-2xl flex-shrink-0">{deal.imageEmoji}</span>
        <div className="flex-1 min-w-0">
          <Link href={`/deals/${deal.slug}`} className="font-serif text-sm font-bold text-witch-100 group-hover:text-gold-400 transition-colors block truncate">
            {deal.title}
          </Link>
          <p className="text-xs text-witch-400 mt-0.5">{deal.storeName}</p>
          {deal.creditType && (
            <span className="inline-block mt-1.5 text-[10px] font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded">
              {deal.creditType}
            </span>
          )}
        </div>
        <Link href={`/go/${deal.slug}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-gold-500 text-witch-950 rounded-lg hover:bg-gold-400 transition-colors">
          Get Deal
        </Link>
      </div>
    );
  }

  return (
    <Link href={`/deals/${deal.slug}`} className="deal-card flex flex-col h-full group">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl" role="img" aria-label={deal.storeName}>{deal.imageEmoji}</span>
          <div className="flex items-center gap-2">
            {deal.featured && <span className="badge-gold">Featured</span>}
            {expDays !== null && expDays <= 14 && expDays > 0 && (
              <span className={expDays <= 3 ? "badge-ember" : "badge-gold"}>
                {expDays}d left
              </span>
            )}
          </div>
        </div>
        <h3 className="font-serif text-lg font-bold text-witch-100 mb-1 group-hover:text-gold-400 transition-colors leading-snug">
          {deal.title}
        </h3>
        <p className="text-xs font-medium uppercase tracking-wider text-witch-500 mb-2">
          {deal.storeName} &middot; {deal.category.name}
        </p>
        <p className="text-sm text-witch-300 leading-relaxed mb-4 flex-1">
          {deal.descriptionShort}
        </p>
        {deal.creditType && (
          <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs font-semibold text-gold-400">{deal.creditType}</p>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-witch-500">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-witch-800/60 px-2 py-0.5 rounded text-witch-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
