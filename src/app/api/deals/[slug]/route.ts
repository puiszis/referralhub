import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sanitizeDealForPublic } from "@/lib/sanitize";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const deal = await prisma.deal.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!deal || deal.status !== "active") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(sanitizeDealForPublic(deal as unknown as Record<string, unknown>));
}
