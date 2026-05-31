"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

type UserRole = "FOUNDER" | "ADMIN" | "MEMBER" | "VIEWER";
type AccountRole = "MANAGER" | "MEMBER" | "VIEWER";

async function requireFounder() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser || currentUser.role !== "FOUNDER") {
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

function getUserRole(value: string): UserRole | null {
  if (
    value === "FOUNDER" ||
    value === "ADMIN" ||
    value === "MEMBER" ||
    value === "VIEWER"
  ) {
    return value;
  }

  return null;
}

function getAccountRole(value: string): AccountRole | null {
  if (
    value === "MANAGER" ||
    value === "MEMBER" ||
    value === "VIEWER"
  ) {
    return value;
  }

  return null;
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

export async function createUser(formData: FormData) {
  const currentUser = await requireFounder();

  const username = getString(formData, "username");
  const password = getString(formData, "password");
  const name = getString(formData, "name");

  const role =
    getUserRole(getString(formData, "role")) || "MEMBER";

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

export async function deleteUser(formData: FormData) {
  const currentUser = await requireFounder();

  const userId = getString(formData, "userId");

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

  if (user) {
    await logActivity({
      userId: currentUser.id,
      type: "USER_DELETED",
      title: "User deleted",
      description: `${currentUser.username} deleted ${user.username}`,
      metadata: {
        deletedUserId: user.id,
        deletedUsername: user.username,
      },
    });
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  redirect("/admin?toast=user-deleted");
}

export async function updateUserRole(formData: FormData) {
  const currentUser = await requireFounder();

  const userId = getString(formData, "userId");

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

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!targetUser) {
    return;
  }

  if (
    targetUser.role === "FOUNDER" &&
    role !== "FOUNDER"
  ) {
    const foundersCount = await prisma.user.count({
      where: {
        role: "FOUNDER",
      },
    });

    if (foundersCount <= 1) {
      return;
    }
  }

  const updatedUser = await prisma.user.update({
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
      newRole: updatedUser.role,
    },
  });

  redirect("/admin?toast=role-updated");
}

export async function updateUserPermissions(
  formData: FormData
) {
  await requireFounder();

  const userId = getString(formData, "userId");

  if (!userId) {
    return;
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      canCreatePersonalAccounts:
        formData.get("canCreatePersonalAccounts") === "on",

      canCreateSharedAccounts:
        formData.get("canCreateSharedAccounts") === "on",

      canArchiveOwnAccounts:
        formData.get("canArchiveOwnAccounts") === "on",

      canDeleteOwnAccounts:
        formData.get("canDeleteOwnAccounts") === "on",

      canUseCopilot:
        formData.get("canUseCopilot") === "on",

      canViewAnalytics:
        formData.get("canViewAnalytics") === "on",

      canViewReports:
        formData.get("canViewReports") === "on",

      canManageUsers:
        formData.get("canManageUsers") === "on",

      canManageSystem:
        formData.get("canManageSystem") === "on",
    },
  });

  redirect("/admin?toast=permissions-updated");
}

export async function createTradingAccount(formData: FormData) {
  const currentUser = await requireFounder();

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

  redirect("/admin/accounts");
}

export async function addMemberToAccount(formData: FormData) {
  const currentUser = await requireFounder();

  const username = getString(formData, "username");

  const tradingAccountId = getString(
    formData,
    "tradingAccountId"
  );

  const role = getAccountRole(
    getString(formData, "role")
  );

  if (!username || !tradingAccountId || !role) {
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

  await logActivity({
    userId: currentUser.id,
    accountId: tradingAccountId,
    type: "MEMBER_ADDED",
    title: "Member added",
    description: `${currentUser.username} added ${user.username}`,
    metadata: {
      memberId: user.id,
      memberUsername: user.username,
      role,
    },
  });

  redirect("/admin/accounts");
}

export async function updateMemberRole(formData: FormData) {
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
    });

  if (!membership) {
    return;
  }

  const isDowngradingManager =
    membership.role === "MANAGER" &&
    nextRole !== "MANAGER";

  if (isDowngradingManager) {
    const managersCount = await countAccountManagers(
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
    accountId: updatedMembership.tradingAccountId,
    type: "MEMBER_ROLE_UPDATED",
    title: "Member role updated",
    description: `${currentUser.username} updated member role`,
    metadata: {
      membershipId: updatedMembership.id,
      role: updatedMembership.role,
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

  const updatedMembership =
    await prisma.accountMember.update({
      where: {
        id: membershipId,
      },
      data: {
        canCreateTrades:
          formData.get("canCreateTrades") === "on",

        canEditTrades:
          formData.get("canEditTrades") === "on",

        canDeleteTrades:
          formData.get("canDeleteTrades") === "on",

        canViewAnalytics:
          formData.get("canViewAnalytics") === "on",

        canViewReports:
          formData.get("canViewReports") === "on",

        canViewCopilot:
          formData.get("canViewCopilot") === "on",

        canViewMembers:
          formData.get("canViewMembers") === "on",

        canManageMembers:
          formData.get("canManageMembers") === "on",

        canManageRoles:
          formData.get("canManageRoles") === "on",

        canManageAccount:
          formData.get("canManageAccount") === "on",
      },
    });

  await logActivity({
    userId: currentUser.id,
    accountId: updatedMembership.tradingAccountId,
    type: "MEMBER_PERMISSIONS_UPDATED",
    title: "Permissions updated",
    description: `${currentUser.username} updated permissions`,
    metadata: {
      membershipId: updatedMembership.id,
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
    });

  if (!membership) {
    return;
  }

  if (membership.role === "MANAGER") {
    const managersCount = await countAccountManagers(
      membership.tradingAccountId
    );

    if (managersCount <= 1) {
      return;
    }
  }

  await logActivity({
    userId: currentUser.id,
    accountId: membership.tradingAccountId,
    type: "MEMBER_REMOVED",
    title: "Member removed",
    description: `${currentUser.username} removed a member`,
    metadata: {
      membershipId: membership.id,
      userId: membership.userId,
    },
  });

  await prisma.accountMember.delete({
    where: {
      id: membershipId,
    },
  });

  redirect("/admin/accounts");
}

export async function freezeUser(formData: FormData) {
  await requireFounder();

  const userId = getString(formData, "userId");

  if (!userId) {
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

  redirect("/admin?toast=frozen");
}

export async function unfreezeUser(formData: FormData) {
  await requireFounder();

  const userId = getString(formData, "userId");

  if (!userId) {
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

  redirect("/admin?toast=unfrozen");
}

export async function resetUserPassword(formData: FormData) {
  await requireFounder();

  const userId = getString(formData, "userId");
  const password = getString(formData, "password");

  if (!userId || !password) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
  });

  redirect("/admin?toast=password-reset");
}
