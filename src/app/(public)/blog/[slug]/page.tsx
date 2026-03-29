import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, parseTags } from "@/lib/utils";
import DealCard from "@/components/DealCard";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Post Not Found | Bewitched Bashes" };
  return {
    title: post.seoTitle || `${post.title} | Bewitched Bashes`,
    description: post.seoDescription || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== "published") notFound();

  const dealSlugs = parseTags(post.dealSlugs);
  const deals = dealSlugs.length > 0
    ? await prisma.deal.findMany({
        where: { slug: { in: dealSlugs }, status: "active" },
        include: { category: true },
      })
    : [];

  const tags = parseTags(post.tags);

  const otherPosts = await prisma.blogPost.findMany({
    where: { status: "published", id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-witch-500 mb-8">
        <Link href="/" className="hover:text-gold-400">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-gold-400">Blog</Link>
        <span>/</span>
        <span className="text-witch-300">{post.title}</span>
      </nav>

      {/* Post Header */}
      <header className="mb-10">
        <span className="text-5xl mb-4 block">{post.coverEmoji}</span>
        <h1 className="font-serif text-hero font-bold text-witch-100 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-witch-400 mb-4">
          {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          {tags.length > 0 && (
            <div className="flex gap-2">
              {tags.map((tag) => <span key={tag} className="badge-witch text-[10px]">{tag}</span>)}
            </div>
          )}
        </div>
        <p className="text-lg text-witch-300 leading-relaxed border-l-2 border-gold-500/50 pl-4">
          {post.excerpt}
        </p>
      </header>

      {/* Post Content */}
      <div className="mb-12 space-y-4">
        {post.content.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return <h2 key={i} className="font-serif text-xl font-bold text-gold-400 mt-8 mb-3">{block.replace("## ", "")}</h2>;
          }
          if (block.startsWith("### ")) {
            return <h3 key={i} className="font-serif text-lg font-bold text-witch-100 mt-6 mb-2">{block.replace("### ", "")}</h3>;
          }
          if (block.startsWith("- ")) {
            const items = block.split("\n").filter((l) => l.startsWith("- "));
            return (
              <ul key={i} className="list-disc list-inside space-y-1.5 text-witch-300 ml-2">
                {items.map((item, j) => <li key={j}>{item.replace("- ", "")}</li>)}
              </ul>
            );
          }
          return <p key={i} className="text-witch-300 leading-relaxed">{block}</p>;
        })}
      </div>

      {/* Embedded Deals */}
      {deals.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-xl font-bold text-gold-400 mb-4">🛒 Supplies for This Party</h2>
          <div className="space-y-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} compact />
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between mb-12 pt-6 border-t border-witch-800/50">
        <ShareButtons title={post.title} slug={`blog/${post.slug}`} />
      </div>

      {/* More Posts */}
      {otherPosts.length > 0 && (
        <section>
          <h2 className="font-serif text-heading font-bold text-witch-100 mb-6">More Party Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherPosts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card p-5 group">
                <span className="text-2xl mb-2 block">{p.coverEmoji}</span>
                <h3 className="font-serif font-bold text-witch-100 group-hover:text-gold-400 transition-colors text-sm">{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
