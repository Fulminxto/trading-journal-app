import { prisma } from "@/lib/prisma";

export type AccountPermissionFlags = {
  role: string;

  canCreateTrades: boolean;
  canEditTrades: boolean;
  canDeleteTrades: boolean;

  canViewAnalytics: boolean;
  canViewReports: boolean;
  canViewCopilot: boolean;
  canViewMembers: boolean;

  canManageMembers: boolean;
  canManageRoles: boolean;
  canManageAccount: boolean;
};

export type AccountNavigationPermissions = AccountPermissionFlags & {
  accountStatus: string;
};

const PERMISSION_SELECT = {
  role: true,

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
} as const;

export function isManager(membership: { role: string }): boolean {
  return membership.role === "MANAGER";
}

export function canManageRules(
  membership: AccountPermissionFlags
): boolean {
  return isManager(membership) || membership.canManageAccount;
}

export function canUseCopilot(
  membership: AccountPermissionFlags
): boolean {
  return isManager(membership) || membership.canViewCopilot;
}

export async function getAccountPermissions(
  userId: string,
  accountId: string
) {
  const membership = await prisma.accountMember.findFirst({
    where: {
      userId,
      tradingAccountId: accountId,
    },
    select: {
      ...PERMISSION_SELECT,
      tradingAccount: { select: { status: true } },
    },
  });

  if (!membership) return null;

  const { tradingAccount, ...permissions } = membership;
  return {
    ...permissions,
    accountStatus: tradingAccount.status,
  };
}

export async function getAccountMembershipWithAccount(
  userId: string,
  accountId: string
) {
  return prisma.accountMember.findFirst({
    where: {
      userId,
      tradingAccountId: accountId,
    },
    include: {
      tradingAccount: true,
    },
  });
}
