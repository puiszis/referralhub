import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

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

  const body = await request.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      blogTitle: body.blogTitle,
      tagline: body.tagline,
      aboutContent: body.aboutContent,
      ftcDisclosure: body.ftcDisclosure,
      operatorName: body.operatorName,
      operatorEmail: body.operatorEmail,
    },
    create: {
      blogTitle: body.blogTitle || "ReferralHub",
      tagline: body.tagline || "",
      aboutContent: body.aboutContent || "",
      ftcDisclosure: body.ftcDisclosure || "",
      operatorName: body.operatorName || "",
      operatorEmail: body.operatorEmail || "",
    },
  });
  return NextResponse.json(settings);
}
