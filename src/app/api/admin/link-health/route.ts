import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const deals = await prisma.deal.findMany({
    where: { status: { in: ["active", "paused"] } },
    include: {
      linkChecks: { orderBy: { checkedAt: "desc" }, take: 1 },
      category: true,
    },
    orderBy: { title: "asc" },
  });

  const results = deals.map((deal) => {
    const lastCheck = deal.linkChecks[0] || null;
    return {
      id: deal.id,
      title: deal.title,
      slug: deal.slug,
      storeName: deal.storeName,
      referralUrl: deal.referralUrl,
      status: deal.status,
      lastCheck: lastCheck
        ? {
            checkedAt: lastCheck.checkedAt,
            statusCode: lastCheck.statusCode,
            responseTimeMs: lastCheck.responseTimeMs,
            isHealthy: lastCheck.isHealthy,
            errorMessage: lastCheck.errorMessage,
          }
        : null,
    };
  });

  const healthy = results.filter((r) => r.lastCheck?.isHealthy).length;
  const broken = results.filter((r) => r.lastCheck && !r.lastCheck.isHealthy).length;
  const unchecked = results.filter((r) => !r.lastCheck).length;

  return NextResponse.json({ results, summary: { healthy, broken, unchecked, total: results.length } });
}
