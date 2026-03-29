import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeString } from "@/lib/sanitize";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const subscriberCount = await prisma.newsletter.count({ where: { active: true } });

  return NextResponse.json({ settings, categories, subscriberCount });
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        blogTitle: sanitizeString(body.blogTitle, 200),
        tagline: sanitizeString(body.tagline, 500),
        aboutContent: sanitizeString(body.aboutContent, 10000),
        ftcDisclosure: sanitizeString(body.ftcDisclosure, 5000),
        operatorName: sanitizeString(body.operatorName, 100),
        operatorEmail: sanitizeString(body.operatorEmail, 254),
      },
      create: {
        blogTitle: sanitizeString(body.blogTitle, 200) || "ReferralHub",
        tagline: sanitizeString(body.tagline, 500),
        aboutContent: sanitizeString(body.aboutContent, 10000),
        ftcDisclosure: sanitizeString(body.ftcDisclosure, 5000),
        operatorName: sanitizeString(body.operatorName, 100),
        operatorEmail: sanitizeString(body.operatorEmail, 254),
      },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
