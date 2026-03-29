import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { deviceTypeFromUA, hashIP } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const deal = await prisma.deal.findUnique({ where: { slug: params.slug } });

  if (!deal) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const ua = request.headers.get("user-agent") || "";
  const referrer = request.headers.get("referer") || "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    await Promise.all([
      prisma.click.create({
        data: {
          dealId: deal.id,
          referrerUrl: referrer || null,
          userAgent: ua.substring(0, 500),
          ipHash: hashIP(ip),
          deviceType: deviceTypeFromUA(ua),
          sourcePage: referrer || null,
        },
      }),
      prisma.deal.update({
        where: { id: deal.id },
        data: { clickCount: { increment: 1 } },
      }),
    ]);
  } catch (e) {
    console.error("Click tracking error:", e);
  }

  return NextResponse.redirect(deal.referralUrl, { status: 302 });
}
