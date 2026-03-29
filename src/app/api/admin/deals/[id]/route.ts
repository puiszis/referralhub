import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { validateDealInput, sanitizeDealData } from "@/lib/validate";
import { safeErrorMessage } from "@/lib/sanitize";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const validation = validateDealInput(body, true);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }

    const data = sanitizeDealData(body);
    const slug = body.slug ? slugify(String(body.slug)) : slugify(data.title);

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        ...data,
        slug,
        ...(body.imageUrl !== undefined && { imageUrl: String(body.imageUrl).substring(0, 2000) || null }),
      },
    });
    return NextResponse.json(deal);
  } catch (e: unknown) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to update deal") }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    const VALID_STATUSES = ["draft", "active", "paused", "expired", "archived"];
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(String(body.status))) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = String(body.status);
    }
    if (body.featured !== undefined) data.featured = body.featured === true;

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(deal);
  } catch (e: unknown) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to patch deal") }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.deal.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to delete deal") }, { status: 400 });
  }
}
