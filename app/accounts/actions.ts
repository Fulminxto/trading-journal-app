"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { redirect } from "next/navigation";

const ACCOUNT_TYPES = [
  "DEMO",
  "LIVE",
  "PROP",
  "SHARED",
  "CHALLENGE",
  "FUNDED",
] as const;

type AccountType = (typeof ACCOUNT_TYPES)[number];

const ALLOWED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
] as const;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getLimitedString(
  formData: FormData,
  key: string,
  maxLength: number
) {
  return getString(formData, key).slice(0, maxLength);
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(value.replace(",", "."));

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function getAccountType(value: string): AccountType | null {
  if (ACCOUNT_TYPES.includes(value as AccountType)) {
    return value as AccountType;
  }

  return null;
}

function getCurrency(value: string) {
  const normalizedValue = value.toUpperCase();

  if (
    ALLOWED_CURRENCIES.includes(
      normalizedValue as (typeof ALLOWED_CURRENCIES)[number]
    )
  ) {
    return normalizedValue;
  }

  return "USD";
}

function getSafeRedirectPath(value: string) {
  if (!value || !value.startsWith("/")) {
    return "/accounts";
  }

  if (value.startsWith("//")) {
    return "/accounts";
  }

  if (value.includes("://")) {
    return "/accounts";
  }

  return value;
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

async function getManageContext(
  userId: string,
  accountId: string
) {
  const account =
    await prisma.tradingAccount.findUnique({
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

  const name = getLimitedString(formData, "name", 80);

  const type = getAccountType(
    getString(formData, "type")
  );

  const initialBalance =
    getNumber(formData, "initialBalance") || 0;

  const currency = getCurrency(
    getString(formData, "currency") || "USD"
  );

  const broker = getLimitedString(
    formData,
    "broker",
    80
  );

  const phase = getLimitedString(
    formData,
    "phase",
    80
  );

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

  const isSharedAccount =
    type === "SHARED";

  const canCreatePersonalAccount =
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN" ||
    currentUser.canCreatePersonalAccounts;

  const canCreateSharedAccount =
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN" ||
    currentUser.canCreateSharedAccounts;

  if (
    isSharedAccount &&
    !canCreateSharedAccount
  ) {
    return;
  }

  if (
    !isSharedAccount &&
    !canCreatePersonalAccount
  ) {
    return;
  }

  const account =
    await prisma.tradingAccount.create({
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
      role: "MANAGER",
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

  await logActivity({
    userId: currentUser.id,
    accountId: account.id,
    type: "ACCOUNT_CREATED",
    title: "Account created",
    description: `${currentUser.username} created ${account.name}`,
    metadata: {
      accountId: account.id,
      accountName: account.name,
      accountType: account.type,
      initialBalance: account.initialBalance,
      currency: account.currency,
    },
  });

  redirect(`/accounts/${account.id}/dashboard`);
}

export async function archiveAccount(formData: FormData) {
  const currentUser = await getCurrentUser();

  const accountId = getString(formData, "accountId");

  const redirectTo = getSafeRedirectPath(
    getString(formData, "redirectTo") ||
    "/admin/accounts"
  );

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
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN" ||
    (
      context.isCreator &&
      currentUser.canArchiveOwnAccounts
    );

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

  await logActivity({
    userId: currentUser.id,
    accountId,
    type: "ACCOUNT_ARCHIVED",
    title: "Account archived",
    description: `${currentUser.username} archived ${context.account.name}`,
    metadata: {
      accountId,
      accountName: context.account.name,
      before: "ACTIVE",
      after: "ARCHIVED",
      field: "status",
    },
  });

  redirect(redirectTo);
}

export async function restoreAccount(formData: FormData) {
  const currentUser = await getCurrentUser();

  const accountId = getString(formData, "accountId");

  const redirectTo = getSafeRedirectPath(
    getString(formData, "redirectTo") ||
    "/admin/accounts"
  );

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
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN" ||
    (
      context.isCreator &&
      currentUser.canArchiveOwnAccounts
    );

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

  await logActivity({
    userId: currentUser.id,
    accountId,
    type: "ACCOUNT_RESTORED",
    title: "Account restored",
    description: `${currentUser.username} restored ${context.account.name}`,
    metadata: {
      accountId,
      accountName: context.account.name,
      before: "ARCHIVED",
      after: "ACTIVE",
      field: "status",
    },
  });

  redirect(redirectTo);
}

export async function deleteAccount(formData: FormData) {
  const currentUser = await getCurrentUser();

  const accountId = getString(formData, "accountId");

  const redirectTo = getSafeRedirectPath(
    getString(formData, "redirectTo") ||
    "/admin/accounts"
  );

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
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN" ||
    (
      context.isCreator &&
      currentUser.canDeleteOwnAccounts
    );

  if (!canDelete) {
    return;
  }

  await logActivity({
    userId: currentUser.id,
    accountId: null,
    type: "ACCOUNT_DELETED",
    title: "Account deleted",
    description: `${currentUser.username} deleted ${context.account.name}`,
    metadata: {
      deletedAccountId: accountId,
      deletedAccountName: context.account.name,
      deletedAccountType: context.account.type,
      deletedAccountStatus: context.account.status,
    },
  });

  await prisma.tradingAccount.delete({
    where: {
      id: accountId,
    },
  });

  redirect(redirectTo);
}