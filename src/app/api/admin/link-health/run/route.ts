import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { isSafeExternalUrl } from "@/lib/sanitize";

async function checkLink(url: string): Promise<{ statusCode: number; responseTimeMs: number; isHealthy: boolean; errorMessage: string | null }> {
  if (!isSafeExternalUrl(url)) {
    return { statusCode: 0, responseTimeMs: 0, isHealthy: false, errorMessage: "URL blocked by security policy (internal/private network)" };
  }

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "ReferralHub-LinkChecker/1.0" },
    });
    clearTimeout(timeout);
    const responseTimeMs = Date.now() - start;
    const isHealthy = response.status >= 200 && response.status < 400;
    return { statusCode: response.status, responseTimeMs, isHealthy, errorMessage: isHealthy ? null : `HTTP ${response.status}` };
  } catch (e: unknown) {
    const responseTimeMs = Date.now() - start;
    const message = e instanceof Error ? e.message : "Unknown error";
    return { statusCode: 0, responseTimeMs, isHealthy: false, errorMessage: message };
  }
}

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  const deals = await prisma.deal.findMany({
    where: { status: { in: ["active", "paused"] } },
  });

  const results = [];
  for (const deal of deals) {
    const check = await checkLink(deal.referralUrl);
    await prisma.linkCheck.create({
      data: {
        dealId: deal.id,
        statusCode: check.statusCode,
        responseTimeMs: check.responseTimeMs,
        isHealthy: check.isHealthy,
        errorMessage: check.errorMessage,
      },
    });

    if (!check.isHealthy && deal.status === "active") {
      await prisma.deal.update({
        where: { id: deal.id },
        data: { status: "paused" },
      });
    }

    results.push({ dealId: deal.id, title: deal.title, ...check });
  }

  return NextResponse.json({ checked: results.length, results });
}
