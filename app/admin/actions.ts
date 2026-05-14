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

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

  if (
    !currentUser ||
    currentUser.role !== "OWNER"
  ) {
    redirect("/accounts");
  }

  return currentUser;
}

export async function createUser(
  formData: FormData
) {
  await requireOwner();

  const username = formData.get(
    "username"
  ) as string;

  const password = formData.get(
    "password"
  ) as string;

  const name = formData.get(
    "name"
  ) as string;

  if (!username || !password) {
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

  const passwordHash =
    await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
      name,
      role: "USER",
    },
  });

  redirect("/admin");
}

export async function createTradingAccount(
  formData: FormData
) {
  const currentUser =
    await requireOwner();

  const name = formData.get(
    "name"
  ) as string;

  const type = formData.get(
    "type"
  ) as
    | "DEMO"
    | "LIVE"
    | "PROP"
    | "SHARED"
    | "CHALLENGE"
    | "FUNDED";

  const initialBalance = Number(
    formData.get("initialBalance")
  );

  const currency = formData.get(
    "currency"
  ) as string;

  const broker = formData.get(
    "broker"
  ) as string;

  const phase = formData.get(
    "phase"
  ) as string;

  const profitTarget = Number(
    formData.get("profitTarget")
  );

  const maxDrawdown = Number(
    formData.get("maxDrawdown")
  );

  const dailyDrawdown = Number(
    formData.get("dailyDrawdown")
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

        broker:
          broker || null,

        phase:
          phase || null,

        profitTarget:
          !isNaN(profitTarget)
            ? profitTarget
            : null,

        maxDrawdown:
          !isNaN(maxDrawdown)
            ? maxDrawdown
            : null,

        dailyDrawdown:
          !isNaN(dailyDrawdown)
            ? dailyDrawdown
            : null,
      },
    });

  await prisma.accountMember.create({
    data: {
      userId: currentUser.id,
      tradingAccountId:
        account.id,
      role: "OWNER",
    },
  });

  redirect("/admin/accounts");
}

export async function addMemberToAccount(
  formData: FormData
) {
  await requireOwner();

  const username = formData.get(
    "username"
  ) as string;

  const tradingAccountId =
    formData.get(
      "tradingAccountId"
    ) as string;

  const role = formData.get(
    "role"
  ) as "OWNER" | "MEMBER";

  const user =
    await prisma.user.findUnique({
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

  redirect("/admin/accounts");
}

export async function removeMemberFromAccount(
  formData: FormData
) {
  await requireOwner();

  const membershipId = formData.get(
    "membershipId"
  ) as string;

  await prisma.accountMember.delete({
    where: {
      id: membershipId,
    },
  });

  redirect("/admin/accounts");
}