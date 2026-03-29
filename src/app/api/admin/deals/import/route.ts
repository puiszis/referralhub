import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { deals } = await request.json();
    if (!Array.isArray(deals)) {
      return NextResponse.json({ error: "Expected an array of deals" }, { status: 400 });
    }

    let imported = 0;
    for (const deal of deals) {
      await prisma.deal.upsert({
        where: { slug: deal.slug },
        update: deal,
        create: deal,
      });
      imported++;
    }

    return NextResponse.json({ imported });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
