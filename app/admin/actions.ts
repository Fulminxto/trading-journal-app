"use server";

import { canManageUsers } from "@/lib/permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

type AccountRole = "OWNER" | "MEMBER" | "VIEWER";

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

  if (
    !currentUser ||
    !canManageUsers(currentUser.role)
  ) {
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

function getAccountRole(value: string): AccountRole | null {
  if (
    value === "OWNER" ||
    value === "MEMBER" ||
    value === "VIEWER"
  ) {
    return value;
  }

  return null;
}

async function countAccountOwners(
  tradingAccountId: string
) {
  return prisma.accountMember.count({
    where: {
      tradingAccountId,
      role: "OWNER",
    },
  });
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
      role: "MEMBER",
    },
  });

  redirect("/admin?toast=user-created");
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

  redirect("/admin?toast=user-deleted");
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

  redirect("/admin/accounts");
}

export async function updateMemberRole(formData: FormData) {
  await requireOwner();

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

  const isDowngradingOwner =
    membership.role === "OWNER" &&
    nextRole !== "OWNER";

  if (isDowngradingOwner) {
    const ownersCount = await countAccountOwners(
      membership.tradingAccountId
    );

    if (ownersCount <= 1) {
      return;
    }
  }

  await prisma.accountMember.update({
    where: {
      id: membershipId,
    },
    data: {
      role: nextRole,
    },
  });

  redirect("/admin/accounts");
}

export async function removeMemberFromAccount(
  formData: FormData
) {
  await requireOwner();

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

  if (membership.role === "OWNER") {
    const ownersCount = await countAccountOwners(
      membership.tradingAccountId
    );

    if (ownersCount <= 1) {
      return;
    }
  }

  await prisma.accountMember.delete({
    where: {
      id: membershipId,
    },
  });

  redirect("/admin/accounts");
}

export async function freezeUser(formData: FormData) {
  await requireOwner();

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
  await requireOwner();

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
  await requireOwner();

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