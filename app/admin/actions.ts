"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function requireOwner() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser || currentUser.role !== "OWNER") {
    redirect("/accounts");
  }

  return currentUser;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
}

export async function createUser(formData: FormData) {
  await requireOwner();

  const username = getString(formData, "username");
  const password = getString(formData, "password");
  const name = getString(formData, "name");

  if (!username || !password) {
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
      name: name || null,
      role: "USER",
    },
  });

  redirect("/admin");
}

export async function deleteUser(formData: FormData) {
  const currentUser = await requireOwner();

  const userId = getString(formData, "userId");

  if (!userId) {
    return;
  }

  if (userId === currentUser.id) {
    return;
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  redirect("/admin");
}

export async function createTradingAccount(formData: FormData) {
  const currentUser = await requireOwner();

  const name = getString(formData, "name");

  const type = getString(formData, "type") as
    | "DEMO"
    | "LIVE"
    | "PROP"
    | "SHARED"
    | "CHALLENGE"
    | "FUNDED";

  const initialBalance =
    getNumber(formData, "initialBalance") || 0;

  const currency =
    getString(formData, "currency") || "USD";

  const broker = getString(formData, "broker");
  const phase = getString(formData, "phase");

  const profitTarget = getNumber(
    formData,
    "profitTarget"
  );

  const maxDrawdown = getNumber(
    formData,
    "maxDrawdown"
  );

  const dailyDrawdown = getNumber(
    formData,
    "dailyDrawdown"
  );

  if (!name || !type) {
    return;
  }

  const account = await prisma.tradingAccount.create({
    data: {
      name,
      type,
      initialBalance,
      currency,
      broker: broker || null,
      phase: phase || null,
      profitTarget,
      maxDrawdown,
      dailyDrawdown,
    },
  });

  await prisma.accountMember.create({
    data: {
      userId: currentUser.id,
      tradingAccountId: account.id,
      role: "OWNER",
    },
  });

  redirect("/admin/accounts");
}

export async function addMemberToAccount(formData: FormData) {
  await requireOwner();

  const username = getString(formData, "username");

  const tradingAccountId = getString(
    formData,
    "tradingAccountId"
  );

  const role = getString(formData, "role") as
    | "OWNER"
    | "MEMBER";

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return;
  }

  const existing = await prisma.accountMember.findFirst({
    where: {
      userId: user.id,
      tradingAccountId,
    },
  });

  if (existing) {
    return;
  }

  await prisma.accountMember.create({
    data: {
      userId: user.id,
      tradingAccountId,
      role,
    },
  });

  redirect("/admin/accounts");
}

export async function removeMemberFromAccount(formData: FormData) {
  await requireOwner();

  const membershipId = getString(formData, "membershipId");

  if (!membershipId) {
    return;
  }

  await prisma.accountMember.delete({
    where: {
      id: membershipId,
    },
  });

  redirect("/admin/accounts");
}