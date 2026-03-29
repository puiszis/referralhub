import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const deals = await prisma.deal.findMany({
    orderBy: { dateAdded: "desc" },
    include: { category: true },
  });
  return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.title);

    const deal = await prisma.deal.create({
      data: {
        title: body.title,
        slug,
        storeName: body.storeName,
        storeUrl: body.storeUrl || null,
        referralUrl: body.referralUrl,
        referralCode: body.referralCode || null,
        categoryId: body.categoryId,
        descriptionShort: body.descriptionShort,
        descriptionLong: body.descriptionLong || null,
        creditType: body.creditType || null,
        creditValueUser: parseFloat(body.creditValueUser) || 0,
        creditValueOperator: parseFloat(body.creditValueOperator) || 0,
        imageEmoji: body.imageEmoji || "🔗",
        imageUrl: body.imageUrl || null,
        tags: JSON.stringify(body.tags || []),
        featured: body.featured || false,
        status: body.status || "draft",
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        source: body.source || "manual",
        notes: body.notes || null,
      },
    });
    return NextResponse.json(deal, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create deal";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
