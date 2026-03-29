import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { validateDealInput, sanitizeDealData } from "@/lib/validate";
import { slugify } from "@/lib/utils";
import { safeErrorMessage } from "@/lib/sanitize";

const MAX_IMPORT_SIZE = 100;

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { deals } = await request.json();
    if (!Array.isArray(deals)) {
      return NextResponse.json({ error: "Expected an array of deals" }, { status: 400 });
    }
    if (deals.length > MAX_IMPORT_SIZE) {
      return NextResponse.json({ error: `Maximum ${MAX_IMPORT_SIZE} deals per import` }, { status: 400 });
    }

    let imported = 0;
    const errors: string[] = [];

    for (let i = 0; i < deals.length; i++) {
      const deal = deals[i];
      const validation = validateDealInput(deal);
      if (!validation.valid) {
        errors.push(`Deal ${i + 1}: ${validation.errors.join(", ")}`);
        continue;
      }

      const data = sanitizeDealData(deal);
      const slug = deal.slug ? slugify(String(deal.slug)) : slugify(data.title);

      try {
        await prisma.deal.upsert({
          where: { slug },
          update: { ...data, slug },
          create: { ...data, slug },
        });
        imported++;
      } catch (e: unknown) {
        errors.push(`Deal ${i + 1} (${slug}): ${safeErrorMessage(e, "Import failed")}`);
      }
    }

    return NextResponse.json({ imported, errors: errors.length > 0 ? errors : undefined });
  } catch {
    return NextResponse.json({ error: "Invalid import data" }, { status: 400 });
  }
}
