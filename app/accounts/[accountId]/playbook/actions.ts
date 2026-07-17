"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE,
  isArchivedAccount,
} from "@/lib/account-write-guard";

async function getMembership(accountId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.accountMember.findFirst({
    where: { userId: session.user.id, tradingAccountId: accountId },
    include: { tradingAccount: { select: { status: true } } },
  });

  if (!membership) redirect("/accounts");
  return { membership, userId: session.user.id };
}

async function createStrategyRecord(
  accountId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const { membership } = await getMembership(accountId);

  if (!membership.canCreateTrades) {
    return { error: "Non hai il permesso di creare strategie." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    return { error: "Nome strategia obbligatorio." };
  }

  const description = formData.get("description");
  const color = formData.get("color");

  try {
    await prisma.strategy.create({
      data: {
        tradingAccountId: accountId,
        name: name.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        color: typeof color === "string" && color ? color : null,
      },
    });
  } catch {
    return { error: "Esiste gia una strategia con questo nome." };
  }

  revalidatePath(`/accounts/${accountId}/playbook`);
  return {};
}

async function updateStrategyRecord(
  accountId: string,
  strategyId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const { membership } = await getMembership(accountId);

  if (!membership.canCreateTrades) {
    return { error: "Non hai il permesso di modificare strategie." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  const existing = await prisma.strategy.findFirst({
    where: { id: strategyId, tradingAccountId: accountId },
  });
  if (!existing) return { error: "Strategia non trovata." };

  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    return { error: "Nome strategia obbligatorio." };
  }

  const description = formData.get("description");
  const color = formData.get("color");

  try {
    await prisma.strategy.update({
      where: { id: strategyId },
      data: {
        name: name.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        color: typeof color === "string" && color ? color : null,
      },
    });
  } catch {
    return { error: "Esiste gia una strategia con questo nome." };
  }

  revalidatePath(`/accounts/${accountId}/playbook`);
  return {};
}

export async function createStrategy(
  accountId: string,
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  return createStrategyRecord(accountId, formData);
}

export async function updateStrategy(
  accountId: string,
  strategyId: string,
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  return updateStrategyRecord(accountId, strategyId, formData);
}

export async function deleteStrategy(
  accountId: string,
  strategyId: string
): Promise<{ error?: string }> {
  const { membership } = await getMembership(accountId);

  if (!membership.canCreateTrades) {
    return { error: "Non hai il permesso di eliminare strategie." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  const existing = await prisma.strategy.findFirst({
    where: { id: strategyId, tradingAccountId: accountId },
  });
  if (!existing) return { error: "Strategia non trovata." };

  await prisma.strategy.delete({ where: { id: strategyId } });

  revalidatePath(`/accounts/${accountId}/playbook`);
  return {};
}

export async function createStrategyFromForm(
  accountId: string,
  formData: FormData
) {
  await createStrategyRecord(accountId, formData);
}

export async function updateStrategyFromForm(
  accountId: string,
  strategyId: string,
  formData: FormData
) {
  await updateStrategyRecord(accountId, strategyId, formData);
}

export async function deleteStrategyFromForm(
  accountId: string,
  strategyId: string,
  _formData: FormData
) {
  await deleteStrategy(accountId, strategyId);
}
