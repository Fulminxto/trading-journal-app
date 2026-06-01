"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

type UserRole = "FOUNDER" | "ADMIN" | "MEMBER" | "VIEWER";
type AccountRole = "MANAGER" | "MEMBER" | "VIEWER";

type AccountType =
  | "DEMO"
  | "LIVE"
  | "PROP"
  | "SHARED"
  | "CHALLENGE"
  | "FUNDED";

const USER_ROLES: UserRole[] = [
  "FOUNDER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
];

const ACCOUNT_ROLES: AccountRole[] = [
  "MANAGER",
  "MEMBER",
  "VIEWER",
];

const ACCOUNT_TYPES: AccountType[] = [
  "DEMO",
  "LIVE",
  "PROP",
  "SHARED",
  "CHALLENGE",
  "FUNDED",
];

const ALLOWED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
];

async function requireFounder() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

  if (
    !currentUser ||
    currentUser.role !== "FOUNDER"
  ) {
    redirect("/accounts");
  }

  return currentUser;
}

function getString(
  formData: FormData,
  key: string
) {
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
  return getString(formData, key).slice(
    0,
    maxLength
  );
}

function getNumber(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(
    value.replace(",", ".")
  );

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function getUserRole(
  value: string
): UserRole | null {
  if (USER_ROLES.includes(value as UserRole)) {
    return value as UserRole;
  }

  return null;
}

function getAccountRole(
  value: string
): AccountRole | null {
  if (
    ACCOUNT_ROLES.includes(
      value as AccountRole
    )
  ) {
    return value as AccountRole;
  }

  return null;
}

function getAccountType(
  value: string
): AccountType | null {
  if (
    ACCOUNT_TYPES.includes(
      value as AccountType
    )
  ) {
    return value as AccountType;
  }

  return null;
}

function getCurrency(value: string) {
  const normalizedValue =
    value.trim().toUpperCase();

  if (
    ALLOWED_CURRENCIES.includes(
      normalizedValue
    )
  ) {
    return normalizedValue;
  }

  return "USD";
}

async function countFounders() {
  return prisma.user.count({
    where: {
      role: "FOUNDER",
    },
  });
}

async function countAccountManagers(
  tradingAccountId: string
) {
  return prisma.accountMember.count({
    where: {
      tradingAccountId,
      role: "MANAGER",
    },
  });
}

async function isSoleManagerOnAnyAccount(
  userId: string
) {
  const managerMemberships =
    await prisma.accountMember.findMany({
      where: {
        userId,
        role: "MANAGER",
      },
      select: {
        tradingAccountId: true,
      },
    });

  for (const membership of managerMemberships) {
    const managersCount =
      await countAccountManagers(
        membership.tradingAccountId
      );

    if (managersCount <= 1) {
      return true;
    }
  }

  return false;
}

function getPermissionSnapshot(
  membership: {
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
  }
) {
  return {
    canCreateTrades:
      membership.canCreateTrades,

    canEditTrades:
      membership.canEditTrades,

    canDeleteTrades:
      membership.canDeleteTrades,

    canViewAnalytics:
      membership.canViewAnalytics,

    canViewReports:
      membership.canViewReports,

    canViewCopilot:
      membership.canViewCopilot,

    canViewMembers:
      membership.canViewMembers,

    canManageMembers:
      membership.canManageMembers,

    canManageRoles:
      membership.canManageRoles,

    canManageAccount:
      membership.canManageAccount,
  };
}

export async function createUser(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const username = normalizeUsername(
    getString(formData, "username")
  );

  const password = getString(
    formData,
    "password"
  );

  const name = getLimitedString(
    formData,
    "name",
    80
  );

  const requestedRole =
    getUserRole(
      getString(formData, "role")
    ) || "MEMBER";

  const role: UserRole =
    requestedRole === "FOUNDER"
      ? "MEMBER"
      : requestedRole;

  if (!username || !password) {
    return;
  }

  if (password.length < 8) {
    return;
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        username,
      },
    });

  if (existingUser) {
    return;
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      name: name || null,
      role,
    },
  });

  await logActivity({
    userId: currentUser.id,
    type: "USER_CREATED",
    title: "User created",
    description: `${currentUser.username} created ${user.username}`,
    metadata: {
      createdUserId: user.id,
      createdUsername: user.username,
      role: user.role,
    },
  });

  redirect("/admin?toast=user-created");
}

export async function deleteUser(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const userId = getString(
    formData,
    "userId"
  );

  if (!userId) {
    return;
  }

  if (userId === currentUser.id) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return;
  }

  if (user.role === "FOUNDER") {
    const foundersCount =
      await countFounders();

    if (foundersCount <= 1) {
      return;
    }
  }

  const isSoleManager =
    await isSoleManagerOnAnyAccount(user.id);

  if (isSoleManager) {
    return;
  }

  await logActivity({
    userId: currentUser.id,
    type: "USER_DELETED",
    title: "User deleted",
    description: `${currentUser.username} deleted ${user.username}`,
    metadata: {
      deletedUserId: user.id,
      deletedUsername: user.username,
      deletedRole: user.role,
    },
  });

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  redirect("/admin?toast=user-deleted");
}

export async function updateUserRole(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const userId = getString(
    formData,
    "userId"
  );

  const role = getUserRole(
    getString(formData, "role")
  );

  if (!userId || !role) {
    return;
  }

  if (
    userId === currentUser.id &&
    role !== "FOUNDER"
  ) {
    return;
  }

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!targetUser) {
    return;
  }

  if (
    role === "FOUNDER" &&
    targetUser.role !== "FOUNDER"
  ) {
    return;
  }

  if (
    targetUser.role === "FOUNDER" &&
    role !== "FOUNDER"
  ) {
    const foundersCount =
      await countFounders();

    if (foundersCount <= 1) {
      return;
    }
  }

  const updatedUser =
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    });

  await logActivity({
    userId: currentUser.id,
    type: "USER_ROLE_UPDATED",
    title: "User role updated",
    description: `${currentUser.username} changed role of ${updatedUser.username}`,
    metadata: {
      targetUserId: updatedUser.id,
      targetUsername: updatedUser.username,
      before: targetUser.role,
      after: updatedUser.role,
      field: "role",
    },
  });

  redirect("/admin?toast=role-updated");
}

export async function updateUserPermissions(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const userId = getString(
    formData,
    "userId"
  );

  if (!userId) {
    return;
  }

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!targetUser) {
    return;
  }

  if (targetUser.role === "FOUNDER") {
    return;
  }

  const before = {
    canCreatePersonalAccounts:
      targetUser.canCreatePersonalAccounts,

    canCreateSharedAccounts:
      targetUser.canCreateSharedAccounts,

    canArchiveOwnAccounts:
      targetUser.canArchiveOwnAccounts,

    canDeleteOwnAccounts:
      targetUser.canDeleteOwnAccounts,

    canUseCopilot:
      targetUser.canUseCopilot,

    canViewAnalytics:
      targetUser.canViewAnalytics,

    canViewReports:
      targetUser.canViewReports,

    canManageUsers:
      targetUser.canManageUsers,

    canManageSystem:
      targetUser.canManageSystem,
  };

  const updatedUser =
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        canCreatePersonalAccounts:
          formData.get(
            "canCreatePersonalAccounts"
          ) === "on",

        canCreateSharedAccounts:
          formData.get(
            "canCreateSharedAccounts"
          ) === "on",

        canArchiveOwnAccounts:
          formData.get(
            "canArchiveOwnAccounts"
          ) === "on",

        canDeleteOwnAccounts:
          formData.get(
            "canDeleteOwnAccounts"
          ) === "on",

        canUseCopilot:
          formData.get("canUseCopilot") ===
          "on",

        canViewAnalytics:
          formData.get(
            "canViewAnalytics"
          ) === "on",

        canViewReports:
          formData.get("canViewReports") ===
          "on",

        canManageUsers:
          formData.get("canManageUsers") ===
          "on",

        canManageSystem:
          formData.get("canManageSystem") ===
          "on",
      },
    });

  const after = {
    canCreatePersonalAccounts:
      updatedUser.canCreatePersonalAccounts,

    canCreateSharedAccounts:
      updatedUser.canCreateSharedAccounts,

    canArchiveOwnAccounts:
      updatedUser.canArchiveOwnAccounts,

    canDeleteOwnAccounts:
      updatedUser.canDeleteOwnAccounts,

    canUseCopilot:
      updatedUser.canUseCopilot,

    canViewAnalytics:
      updatedUser.canViewAnalytics,

    canViewReports:
      updatedUser.canViewReports,

    canManageUsers:
      updatedUser.canManageUsers,

    canManageSystem:
      updatedUser.canManageSystem,
  };

  await logActivity({
    userId: currentUser.id,
    type: "USER_PERMISSIONS_UPDATED",
    title: "User permissions updated",
    description: `${currentUser.username} updated permissions for ${updatedUser.username}`,
    metadata: {
      targetUserId: updatedUser.id,
      targetUsername: updatedUser.username,
      before,
      after,
    },
  });

  redirect("/admin?toast=permissions-updated");
}

export async function createTradingAccount(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const name = getLimitedString(
    formData,
    "name",
    80
  );

  const type = getAccountType(
    getString(formData, "type")
  );

  const initialBalance =
    getNumber(
      formData,
      "initialBalance"
    ) || 0;

  const currency = getCurrency(
    getString(formData, "currency") ||
    "USD"
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

  redirect("/admin/accounts");
}

export async function addMemberToAccount(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const username = normalizeUsername(
    getString(formData, "username")
  );

  const tradingAccountId = getString(
    formData,
    "tradingAccountId"
  );

  const role = getAccountRole(
    getString(formData, "role")
  );

  if (
    !username ||
    !tradingAccountId ||
    !role
  ) {
    return;
  }

  const account =
    await prisma.tradingAccount.findUnique({
      where: {
        id: tradingAccountId,
      },
    });

  if (!account) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return;
  }

  const existing =
    await prisma.accountMember.findFirst({
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

  await logActivity({
    userId: currentUser.id,
    accountId: tradingAccountId,
    type: "MEMBER_ADDED",
    title: "Member added",
    description: `${currentUser.username} added ${user.username}`,
    metadata: {
      accountId: tradingAccountId,
      accountName: account.name,
      memberId: user.id,
      memberUsername: user.username,
      role,
    },
  });

  redirect("/admin/accounts");
}

export async function updateMemberRole(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const membershipId = getString(
    formData,
    "membershipId"
  );

  const nextRole = getAccountRole(
    getString(formData, "role")
  );

  if (!membershipId || !nextRole) {
    return;
  }

  const membership =
    await prisma.accountMember.findUnique({
      where: {
        id: membershipId,
      },
      include: {
        user: true,
        tradingAccount: true,
      },
    });

  if (!membership) {
    return;
  }

  const isDowngradingManager =
    membership.role === "MANAGER" &&
    nextRole !== "MANAGER";

  if (isDowngradingManager) {
    const managersCount =
      await countAccountManagers(
        membership.tradingAccountId
      );

    if (managersCount <= 1) {
      return;
    }
  }

  const updatedMembership =
    await prisma.accountMember.update({
      where: {
        id: membershipId,
      },
      data: {
        role: nextRole,
      },
    });

  await logActivity({
    userId: currentUser.id,
    accountId:
      updatedMembership.tradingAccountId,
    type: "MEMBER_ROLE_UPDATED",
    title: "Member role updated",
    description: `${currentUser.username} changed role of ${membership.user.username}`,
    metadata: {
      membershipId: updatedMembership.id,
      memberId: membership.userId,
      memberUsername: membership.user.username,
      accountName:
        membership.tradingAccount.name,
      before: membership.role,
      after: updatedMembership.role,
      field: "role",
    },
  });

  redirect("/admin/accounts");
}

export async function updateMemberPermissions(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const membershipId = getString(
    formData,
    "membershipId"
  );

  if (!membershipId) {
    return;
  }

  const membership =
    await prisma.accountMember.findUnique({
      where: {
        id: membershipId,
      },
      include: {
        user: true,
        tradingAccount: true,
      },
    });

  if (!membership) {
    return;
  }

  const before =
    getPermissionSnapshot(membership);

  const updatedMembership =
    await prisma.accountMember.update({
      where: {
        id: membershipId,
      },
      data: {
        canCreateTrades:
          formData.get(
            "canCreateTrades"
          ) === "on",

        canEditTrades:
          formData.get("canEditTrades") ===
          "on",

        canDeleteTrades:
          formData.get(
            "canDeleteTrades"
          ) === "on",

        canViewAnalytics:
          formData.get(
            "canViewAnalytics"
          ) === "on",

        canViewReports:
          formData.get(
            "canViewReports"
          ) === "on",

        canViewCopilot:
          formData.get(
            "canViewCopilot"
          ) === "on",

        canViewMembers:
          formData.get(
            "canViewMembers"
          ) === "on",

        canManageMembers:
          formData.get(
            "canManageMembers"
          ) === "on",

        canManageRoles:
          formData.get(
            "canManageRoles"
          ) === "on",

        canManageAccount:
          formData.get(
            "canManageAccount"
          ) === "on",
      },
    });

  const after =
    getPermissionSnapshot(
      updatedMembership
    );

  await logActivity({
    userId: currentUser.id,
    accountId:
      updatedMembership.tradingAccountId,
    type: "MEMBER_PERMISSIONS_UPDATED",
    title: "Permissions updated",
    description: `${currentUser.username} updated permissions for ${membership.user.username}`,
    metadata: {
      membershipId: updatedMembership.id,
      memberId: membership.userId,
      memberUsername: membership.user.username,
      accountName:
        membership.tradingAccount.name,
      before,
      after,
    },
  });

  redirect("/admin/accounts");
}

export async function removeMemberFromAccount(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const membershipId = getString(
    formData,
    "membershipId"
  );

  if (!membershipId) {
    return;
  }

  const membership =
    await prisma.accountMember.findUnique({
      where: {
        id: membershipId,
      },
      include: {
        user: true,
        tradingAccount: true,
      },
    });

  if (!membership) {
    return;
  }

  if (membership.role === "MANAGER") {
    const managersCount =
      await countAccountManagers(
        membership.tradingAccountId
      );

    if (managersCount <= 1) {
      return;
    }
  }

  await logActivity({
    userId: currentUser.id,
    accountId:
      membership.tradingAccountId,
    type: "MEMBER_REMOVED",
    title: "Member removed",
    description: `${currentUser.username} removed ${membership.user.username}`,
    metadata: {
      membershipId: membership.id,
      userId: membership.userId,
      username: membership.user.username,
      accountName:
        membership.tradingAccount.name,
      role: membership.role,
    },
  });

  await prisma.accountMember.delete({
    where: {
      id: membershipId,
    },
  });

  redirect("/admin/accounts");
}

export async function freezeUser(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const userId = getString(
    formData,
    "userId"
  );

  if (!userId) {
    return;
  }

  if (userId === currentUser.id) {
    return;
  }

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!targetUser) {
    return;
  }

  if (targetUser.role === "FOUNDER") {
    return;
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: "FROZEN",
      frozenAt: new Date(),
    },
  });

  await logActivity({
    userId: currentUser.id,
    type: "USER_FROZEN",
    title: "User frozen",
    description: `${currentUser.username} froze ${targetUser.username}`,
    metadata: {
      targetUserId: targetUser.id,
      targetUsername: targetUser.username,
      before: targetUser.status,
      after: "FROZEN",
      field: "status",
    },
  });

  redirect("/admin?toast=frozen");
}

export async function unfreezeUser(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const userId = getString(
    formData,
    "userId"
  );

  if (!userId) {
    return;
  }

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!targetUser) {
    return;
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: "ACTIVE",
      frozenAt: null,
    },
  });

  await logActivity({
    userId: currentUser.id,
    type: "USER_UNFROZEN",
    title: "User unfrozen",
    description: `${currentUser.username} unfroze ${targetUser.username}`,
    metadata: {
      targetUserId: targetUser.id,
      targetUsername: targetUser.username,
      before: targetUser.status,
      after: "ACTIVE",
      field: "status",
    },
  });

  redirect("/admin?toast=unfrozen");
}

export async function resetUserPassword(
  formData: FormData
) {
  const currentUser = await requireFounder();

  const userId = getString(
    formData,
    "userId"
  );

  const password = getString(
    formData,
    "password"
  );

  if (!userId || !password) {
    return;
  }

  if (password.length < 8) {
    return;
  }

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!targetUser) {
    return;
  }

  if (
    targetUser.role === "FOUNDER" &&
    targetUser.id !== currentUser.id
  ) {
    return;
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  await logActivity({
    userId: currentUser.id,
    type: "PASSWORD_RESET",
    title: "Password reset",
    description: `${currentUser.username} reset password for ${targetUser.username}`,
    metadata: {
      targetUserId: targetUser.id,
      targetUsername: targetUser.username,
    },
  });

  redirect("/admin?toast=password-reset");
}