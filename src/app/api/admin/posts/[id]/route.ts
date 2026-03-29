import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { sanitizeString, safeErrorMessage } from "@/lib/sanitize";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const wasPublished = existing.status === "published";
    const isNowPublished = body.status === "published";

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title: sanitizeString(body.title, 200),
        slug: body.slug ? slugify(String(body.slug)) : slugify(sanitizeString(body.title, 200)),
        excerpt: sanitizeString(body.excerpt, 500),
        content: sanitizeString(body.content, 50000),
        coverEmoji: sanitizeString(body.coverEmoji, 4) || "🎃",
        coverUrl: body.coverUrl ? sanitizeString(body.coverUrl, 2000) : null,
        status: isNowPublished ? "published" : "draft",
        publishedAt: isNowPublished && !wasPublished ? new Date() : existing.publishedAt,
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
    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to update post") }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to delete post") }, { status: 400 });
  }
}
