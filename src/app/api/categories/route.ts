import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { deals: true },
      },
    },
  });

  const result = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    sortOrder: cat.sortOrder,
    iconEmoji: cat.iconEmoji,
    dealCount: cat._count.deals,
  }));

  return NextResponse.json(result);
}
