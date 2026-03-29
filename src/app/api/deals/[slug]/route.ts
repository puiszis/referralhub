import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const deal = await prisma.deal.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}
