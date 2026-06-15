import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { sendLoginCode } from "@/lib/email";
import { generateCode, hashCode } from "@/lib/two-factor";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;
const CODE_TTL_MINUTES = 10;
// Minimum seconds between OTP requests to prevent email spam.
const OTP_COOLDOWN_MS = 60_000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const username =
    typeof (body as Record<string, unknown>)?.username === "string"
      ? ((body as Record<string, unknown>).username as string).trim()
      : null;

  const password =
    typeof (body as Record<string, unknown>)?.password === "string"
      ? ((body as Record<string, unknown>).password as string)
      : null;

  if (!username || !password) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return NextResponse.json({ error: "locked" }, { status: 423 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const failedLoginAttempts = user.failedLoginAttempts + 1;
    const shouldLock = failedLoginAttempts >= MAX_FAILED_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000)
          : null,
      },
    });

    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  // Credentials valid — check whether 2FA is required for this user.
  if (!user.twoFactorEnabled || !user.email) {
    return NextResponse.json({ requires2FA: false });
  }

  // If a code was sent within the last 60 seconds, reuse it — no new email.
  const recentCode = await prisma.twoFactorCode.findFirst({
    where: {
      userId: user.id,
      expiresAt: { gt: new Date() },
      createdAt: { gt: new Date(Date.now() - OTP_COOLDOWN_MS) },
    },
    select: { preAuthToken: true },
  });

  if (recentCode) {
    return NextResponse.json({
      requires2FA: true,
      preAuthToken: recentCode.preAuthToken,
    });
  }

  // Delete this user's previous codes and globally expired codes in parallel.
  await Promise.allSettled([
    prisma.twoFactorCode.deleteMany({ where: { userId: user.id } }),
    prisma.twoFactorCode.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
  ]);

  const code = generateCode();
  const codeHash = await hashCode(code);
  const preAuthToken = randomUUID();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await prisma.twoFactorCode.create({
    data: { userId: user.id, preAuthToken, codeHash, expiresAt },
  });

  await sendLoginCode(user.email, code);

  return NextResponse.json({ requires2FA: true, preAuthToken });
}
