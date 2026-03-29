import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { validateDealInput, sanitizeDealData } from "@/lib/validate";
import { safeErrorMessage } from "@/lib/sanitize";

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
    const validation = validateDealInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }

    const data = sanitizeDealData(body);
    const slug = body.slug ? slugify(String(body.slug)) : slugify(data.title);

    const deal = await prisma.deal.create({
      data: {
        ...data,
        slug,
        ...(body.imageUrl !== undefined && { imageUrl: String(body.imageUrl).substring(0, 2000) }),
      },
    });
    return NextResponse.json(deal, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to create deal") }, { status: 400 });
  }
}
