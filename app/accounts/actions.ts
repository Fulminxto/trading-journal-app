"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type AccountType =
  | "DEMO"
  | "LIVE"
  | "PROP"
  | "SHARED"
  | "CHALLENGE"
  | "FUNDED";

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

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser) {
    redirect("/login");
  }

  return currentUser;
}

async function getManageContext(userId: string, accountId: string) {
  const account = await prisma.tradingAccount.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!account) {
    return null;
  }

  return {
    account,
    isCreator: account.createdById === userId,
  };
}

export async function createAccount(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (currentUser.role === "VIEWER") {
    return;
  }

  const name = getString(formData, "name");
  const type = getString(formData, "type") as AccountType;

  const initialBalance =
    getNumber(formData, "initialBalance") || 0;

  const currency =
    getString(formData, "currency") || "USD";

  const broker = getString(formData, "broker");
  const phase = getString(formData, "phase");

  const profitTarget = getNumber(formData, "profitTarget");
  const maxDrawdown = getNumber(formData, "maxDrawdown");
  const dailyDrawdown = getNumber(formData, "dailyDrawdown");

  if (!name || !type) {
    return;
  }

  const isSharedAccount = type === "SHARED";

  const canCreatePersonalAccount =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    currentUser.canCreatePersonalAccounts;

  const canCreateSharedAccount =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    currentUser.canCreateSharedAccounts;

  if (isSharedAccount && !canCreateSharedAccount) {
    return;
  }

  if (!isSharedAccount && !canCreatePersonalAccount) {
    return;
  }

  const account = await prisma.tradingAccount.create({
    data: {
      name,
      type,
      initialBalance,
      currency,
      createdById: currentUser.id,
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
      canCreateTrades: true,
      canEditTrades: true,
      canDeleteTrades: true,
      canViewAnalytics: true,
      canViewReports: true,
      canViewCopilot: true,
      canViewMembers: true,
      canManageMembers: true,
      canManageRoles: true,
      canManageAccount: true,
    },
  });

  redirect(`/accounts/${account.id}/dashboard`);
}

export async function archiveAccount(formData: FormData) {
  const currentUser = await getCurrentUser();

  const accountId = getString(formData, "accountId");
  const redirectTo =
    getString(formData, "redirectTo") || "/admin/accounts";

  if (!accountId) {
    return;
  }

  const context = await getManageContext(
    currentUser.id,
    accountId
  );

  if (!context) {
    return;
  }

  const canArchive =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    (context.isCreator && currentUser.canArchiveOwnAccounts);

  if (!canArchive) {
    return;
  }

  await prisma.tradingAccount.update({
    where: {
      id: accountId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  redirect(redirectTo);
}

export async function restoreAccount(formData: FormData) {
  const currentUser = await getCurrentUser();

  const accountId = getString(formData, "accountId");
  const redirectTo =
    getString(formData, "redirectTo") || "/admin/accounts";

  if (!accountId) {
    return;
  }

  const context = await getManageContext(
    currentUser.id,
    accountId
  );

  if (!context) {
    return;
  }

  const canRestore =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    (context.isCreator && currentUser.canArchiveOwnAccounts);

  if (!canRestore) {
    return;
  }

  await prisma.tradingAccount.update({
    where: {
      id: accountId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  redirect(redirectTo);
}

export async function deleteAccount(formData: FormData) {
  const currentUser = await getCurrentUser();

  const accountId = getString(formData, "accountId");
  const redirectTo =
    getString(formData, "redirectTo") || "/admin/accounts";

  if (!accountId) {
    return;
  }

  const context = await getManageContext(
    currentUser.id,
    accountId
  );

  if (!context) {
    return;
  }

  const canDelete =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    (context.isCreator && currentUser.canDeleteOwnAccounts);

  if (!canDelete) {
    return;
  }

  await prisma.tradingAccount.delete({
    where: {
      id: accountId,
    },
  });

  redirect(redirectTo);
}