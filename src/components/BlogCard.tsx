import Link from "next/link";
import { formatDate, parseTags } from "@/lib/utils";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverEmoji: string;
    publishedAt: Date | string | null;
    tags: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const tags = parseTags(post.tags);

  return (
    <Link href={`/blog/${post.slug}`} className="blog-card flex flex-col h-full group">
      <div className="p-6 flex flex-col flex-1">
        <span className="text-4xl mb-4 block">{post.coverEmoji}</span>
        <h3 className="font-serif text-xl font-bold text-witch-100 mb-2 group-hover:text-gold-400 transition-colors leading-snug">
          {post.title}
        </h3>
        {post.publishedAt && (
          <p className="text-xs text-witch-500 mb-3">{formatDate(post.publishedAt)}</p>
        )}
        <p className="text-sm text-witch-300 leading-relaxed mb-4 flex-1">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge-witch text-[10px]">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
