import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug || slugify(body.title),
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
    return NextResponse.json(deal);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update deal";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.deal.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to delete deal";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
