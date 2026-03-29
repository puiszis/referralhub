import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

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

  let orderBy: Record<string, string> = { dateAdded: "desc" };
  if (sort === "popular") orderBy = { clickCount: "desc" };
  else if (sort === "expiring") orderBy = { expiresAt: "asc" };
  else if (sort === "featured") orderBy = { featured: "desc" };

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

  return NextResponse.json({ deals, total, page, limit });
}
