import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { sanitizeString, safeErrorMessage } from "@/lib/sanitize";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const title = sanitizeString(body.title, 200);
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: body.slug ? slugify(String(body.slug)) : slugify(title),
        excerpt: sanitizeString(body.excerpt, 500),
        content: sanitizeString(body.content, 50000),
        coverEmoji: sanitizeString(body.coverEmoji, 4) || "🎃",
        coverUrl: body.coverUrl ? sanitizeString(body.coverUrl, 2000) : null,
        status: body.status === "published" ? "published" : "draft",
        publishedAt: body.status === "published" ? new Date() : null,
        tags: JSON.stringify(
          Array.isArray(body.tags) ? body.tags.filter((t: unknown): t is string => typeof t === "string").slice(0, 20) : []
        ),
        dealSlugs: JSON.stringify(
          Array.isArray(body.dealSlugs) ? body.dealSlugs.filter((s: unknown): s is string => typeof s === "string").slice(0, 30) : []
        ),
        seoTitle: body.seoTitle ? sanitizeString(body.seoTitle, 100) : null,
        seoDescription: body.seoDescription ? sanitizeString(body.seoDescription, 200) : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to create post") }, { status: 400 });
  }
}
