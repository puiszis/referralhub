import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const withCounts = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      dealCount: await prisma.deal.count({
        where: { categoryId: cat.id, status: "active" },
      }),
    }))
  );

  return NextResponse.json(withCounts);
}
