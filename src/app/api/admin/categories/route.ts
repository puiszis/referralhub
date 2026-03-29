import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { sanitizeString, safeErrorMessage } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const name = sanitizeString(body.name, 100);
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: body.slug ? slugify(String(body.slug)) : slugify(name),
        description: body.description ? sanitizeString(body.description, 500) : null,
        sortOrder: Math.max(0, Math.min(parseInt(String(body.sortOrder)) || 0, 1000)),
        iconEmoji: sanitizeString(body.iconEmoji, 4) || "📦",
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to create category") }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: body.id },
      data: {
        name: sanitizeString(body.name, 100),
        slug: body.slug ? slugify(String(body.slug)) : slugify(sanitizeString(body.name, 100)),
        description: body.description ? sanitizeString(body.description, 500) : null,
        sortOrder: Math.max(0, Math.min(parseInt(String(body.sortOrder)) || 0, 1000)),
        iconEmoji: sanitizeString(body.iconEmoji, 4) || "📦",
      },
    });
    return NextResponse.json(category);
  } catch (e: unknown) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to update category") }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }

    const dealCount = await prisma.deal.count({ where: { categoryId: body.id } });
    if (dealCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${dealCount} existing deal(s). Reassign or remove them first.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: body.id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: safeErrorMessage(e, "Failed to delete category") }, { status: 400 });
  }
}
