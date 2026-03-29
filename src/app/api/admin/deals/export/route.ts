import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const deals = await prisma.deal.findMany({
    include: { category: true },
    orderBy: { dateAdded: "desc" },
  });

  return NextResponse.json({ deals, exportedAt: new Date().toISOString() });
}
