import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid" },
      { status: 400 }
    );
  }

  const action = (body as Record<string, unknown>)?.action;

  // ── Update email ──────────────────────────────────────────────────────────
  if (action === "update-email") {
    const raw = (body as Record<string, unknown>)?.email;
    const email =
      typeof raw === "string" ? raw.trim().toLowerCase() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "invalid-email" },
        { status: 400 }
      );
    }

    const conflict = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (conflict && conflict.id !== session.user.id) {
      return NextResponse.json(
        { error: "email-taken" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { email },
    });

    return NextResponse.json({ ok: true });
  }

  // ── Enable 2FA ────────────────────────────────────────────────────────────
  if (action === "enable-2fa") {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "not-available" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (!user?.email) {
      return NextResponse.json(
        { error: "no-email" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true },
    });

    return NextResponse.json({ ok: true });
  }

  // ── Disable 2FA ───────────────────────────────────────────────────────────
  if (action === "disable-2fa") {
    await prisma.twoFactorCode.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: false },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "unknown-action" },
    { status: 400 }
  );
}
