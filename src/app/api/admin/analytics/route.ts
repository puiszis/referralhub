import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalActiveDeals,
    clicksToday,
    clicksThisWeek,
    clicksThisMonth,
    allDeals,
    recentClicks,
  ] = await Promise.all([
    prisma.deal.count({ where: { status: "active" } }),
    prisma.click.count({ where: { clickedAt: { gte: todayStart } } }),
    prisma.click.count({ where: { clickedAt: { gte: weekAgo } } }),
    prisma.click.count({ where: { clickedAt: { gte: monthAgo } } }),
    prisma.deal.findMany({
      where: { status: "active" },
      include: { category: true },
      orderBy: { clickCount: "desc" },
      take: 10,
    }),
    prisma.click.findMany({
      where: { clickedAt: { gte: monthAgo } },
      select: { clickedAt: true, deviceType: true, dealId: true },
    }),
  ]);

  const estimatedRevenue = allDeals.reduce(
    (sum, d) => sum + d.clickCount * d.creditValueOperator * 0.1,
    0
  );

  // Daily clicks for chart
  const dailyClicks: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dailyClicks[d.toISOString().split("T")[0]] = 0;
  }
  for (const click of recentClicks) {
    const day = new Date(click.clickedAt).toISOString().split("T")[0];
    if (dailyClicks[day] !== undefined) dailyClicks[day]++;
  }

  // Device breakdown
  const devices: Record<string, number> = {};
  for (const click of recentClicks) {
    const type = click.deviceType || "unknown";
    devices[type] = (devices[type] || 0) + 1;
  }

  // Category breakdown
  const categoryClicks: Record<string, number> = {};
  for (const deal of allDeals) {
    const catName = deal.category.name;
    categoryClicks[catName] = (categoryClicks[catName] || 0) + deal.clickCount;
  }

  return NextResponse.json({
    totalActiveDeals,
    clicksToday,
    clicksThisWeek,
    clicksThisMonth,
    estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
    topDeals: allDeals.slice(0, 5),
    dailyClicks: Object.entries(dailyClicks).map(([date, count]) => ({ date, count })),
    deviceBreakdown: Object.entries(devices).map(([device, count]) => ({ device, count })),
    categoryBreakdown: Object.entries(categoryClicks).map(([category, count]) => ({ category, count })),
  });
}
