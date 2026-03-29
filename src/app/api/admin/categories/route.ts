import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || null,
      sortOrder: body.sortOrder || 0,
      iconEmoji: body.iconEmoji || "📦",
    },
  });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const category = await prisma.category.update({
    where: { id: body.id },
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description,
      sortOrder: body.sortOrder,
      iconEmoji: body.iconEmoji,
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await request.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
