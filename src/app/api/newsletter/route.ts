import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeEmail(body.email);

    if (!email) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await prisma.newsletter.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
