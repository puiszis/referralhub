import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeDealForPublic, clampInt } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.substring(0, 200) || "";
  const category = searchParams.get("category")?.substring(0, 100) || "";
  const sort = searchParams.get("sort") || "newest";
  const page = clampInt(searchParams.get("page"), 1, 1000, 1);
  const limit = clampInt(searchParams.get("limit"), 1, 50, 20);

  const where: Record<string, unknown> = { status: "active" };

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { storeName: { contains: q } },
      { descriptionShort: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  const allowedSorts: Record<string, Record<string, string>> = {
    newest: { dateAdded: "desc" },
    popular: { clickCount: "desc" },
    expiring: { expiresAt: "asc" },
    featured: { featured: "desc" },
  };
  const orderBy = allowedSorts[sort] || allowedSorts.newest;

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where: where as never,
      orderBy,
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.deal.count({ where: where as never }),
  ]);

  return NextResponse.json({
    deals: deals.map((d) => sanitizeDealForPublic(d as unknown as Record<string, unknown>)),
    total,
    page,
    limit,
  });
}
