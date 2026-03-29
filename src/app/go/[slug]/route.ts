import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { deviceTypeFromUA, hashIP } from "@/lib/utils";
import { isValidRedirectUrl } from "@/lib/sanitize";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const deal = await prisma.deal.findUnique({ where: { slug: params.slug } });

  if (!deal) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isValidRedirectUrl(deal.referralUrl)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const ua = request.headers.get("user-agent") || "";
  const referrer = request.headers.get("referer") || "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    await prisma.$transaction([
      prisma.click.create({
        data: {
          dealId: deal.id,
          referrerUrl: referrer ? new URL(referrer).origin : null,
          userAgent: null,
          ipHash: hashIP(ip),
          deviceType: deviceTypeFromUA(ua),
          sourcePage: referrer ? new URL(referrer).pathname : null,
        },
      }),
      prisma.deal.update({
        where: { id: deal.id },
        data: { clickCount: { increment: 1 } },
      }),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    console.error("Click tracking error:", msg);
  }

  const response = NextResponse.redirect(deal.referralUrl, { status: 302 });
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
