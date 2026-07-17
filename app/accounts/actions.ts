"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity, persistActivityLog } from "@/lib/activity";
import { redirect } from "next/navigation";
import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";

const ACCOUNT_TYPES = [
  "DEMO",
  "LIVE",
  "PROP",
  "SHARED",
  "CHALLENGE",
  "FUNDED",
] as const;

type AccountType = (typeof ACCOUNT_TYPES)[number];

export type CreateAccountField =
  | "name"
  | "type"
  | "initialBalance"
  | "currency"
  | "broker"
  | "phase"
  | "profitTarget"
  | "maxDrawdown"
  | "dailyDrawdown";

export type CreateAccountValues = Record<CreateAccountField, string>;

export type CreateAccountState = {
  error?: string;
  fieldErrors?: Partial<Record<CreateAccountField, string>>;
  values?: CreateAccountValues;
};

const creationMessages: Record<AppLanguage, {
  invalid: string;
  unauthorized: string;
  failed: string;
  field: string;
}> = {
  en: { invalid: "Check the highlighted fields and try again.", unauthorized: "You do not have permission to create this account.", failed: "Account creation failed. Please try again.", field: "Check this field." },
  it: { invalid: "Controlla i campi evidenziati e riprova.", unauthorized: "Non hai il permesso di creare questo account.", failed: "Creazione dell'account non riuscita. Riprova.", field: "Controlla questo campo." },
  uk: { invalid: "Перевірте виділені поля та спробуйте ще раз.", unauthorized: "У вас немає дозволу створювати цей акаунт.", failed: "Не вдалося створити акаунт. Спробуйте ще раз.", field: "Перевірте це поле." },
  ru: { invalid: "Проверьте выделенные поля и повторите попытку.", unauthorized: "У вас нет разрешения создавать этот аккаунт.", failed: "Не удалось создать аккаунт. Повторите попытку.", field: "Проверьте это поле." },
  es: { invalid: "Revisa los campos resaltados e inténtalo de nuevo.", unauthorized: "No tienes permiso para crear esta cuenta.", failed: "No se pudo crear la cuenta. Inténtalo de nuevo.", field: "Revisa este campo." },
  fr: { invalid: "Vérifiez les champs signalés et réessayez.", unauthorized: "Vous n’êtes pas autorisé à créer ce compte.", failed: "La création du compte a échoué. Réessayez.", field: "Vérifiez ce champ." },
  de: { invalid: "Prüfe die markierten Felder und versuche es erneut.", unauthorized: "Du bist nicht berechtigt, dieses Konto zu erstellen.", failed: "Das Konto konnte nicht erstellt werden. Versuche es erneut.", field: "Prüfe dieses Feld." },
};

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

  return null;
}

function getSubmittedAccountValues(formData: FormData): CreateAccountValues {
  return {
    name: getString(formData, "name"),
    type: getString(formData, "type"),
    initialBalance: getString(formData, "initialBalance"),
    currency: getString(formData, "currency"),
    broker: getString(formData, "broker"),
    phase: getString(formData, "phase"),
    profitTarget: getString(formData, "profitTarget"),
    maxDrawdown: getString(formData, "maxDrawdown"),
    dailyDrawdown: getString(formData, "dailyDrawdown"),
  };
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

async function createAccountFromForm(formData: FormData): Promise<CreateAccountState> {
  const currentUser = await getCurrentUser();
  const values = getSubmittedAccountValues(formData);
  const messages = creationMessages[normalizeAppLanguage(currentUser.appLanguage)];

  if (currentUser.role === "VIEWER") {
    return {
      error: messages.unauthorized,
      values,
    };
  }

  const name = values.name;
  const type = getAccountType(values.type);
  const initialBalance = getNumber(formData, "initialBalance");
  const currency = getCurrency(values.currency);
  const broker = values.broker;
  const phase = values.phase;

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

  const fieldErrors: CreateAccountState["fieldErrors"] = {};

  if (!name || name.length > 80) {
    fieldErrors.name = messages.field;
  }
  if (!type) {
    fieldErrors.type = messages.field;
  }
  if (initialBalance === null) {
    fieldErrors.initialBalance = messages.field;
  }
  if (!currency) {
    fieldErrors.currency = messages.field;
  }
  if (broker.length > 80) {
    fieldErrors.broker = messages.field;
  }
  if (phase.length > 80) {
    fieldErrors.phase = messages.field;
  }
  if (values.profitTarget && profitTarget === null) {
    fieldErrors.profitTarget = messages.field;
  }
  if (values.maxDrawdown && maxDrawdown === null) {
    fieldErrors.maxDrawdown = messages.field;
  }
  if (values.dailyDrawdown && dailyDrawdown === null) {
    fieldErrors.dailyDrawdown = messages.field;
  }

  if (Object.keys(fieldErrors).length > 0 || !type || !currency || initialBalance === null) {
    return {
      error: messages.invalid,
      fieldErrors,
      values,
    };
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
    return {
      error: messages.unauthorized,
      values,
    };
  }

  if (
    !isSharedAccount &&
    !canCreatePersonalAccount
  ) {
    return {
      error: messages.unauthorized,
      values,
    };
  }

  let account: { id: string };

  try {
    account = await prisma.$transaction(async (tx) => {
      const createdAccount = await tx.tradingAccount.create({
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

      await tx.accountMember.create({
        data: {
          userId: currentUser.id,
          tradingAccountId: createdAccount.id,
          role: "MANAGER",
          canCreateTrades: true,
          canEditTrades: true,
          canDeleteTrades: true,
          canViewAnalytics: true,
          canViewReports: true,
          canViewCopilot: true,
          canViewMembers: true,
          // Reserved for future feature: member/role management by MANAGER. Do not remove.
          canManageMembers: true,
          canManageRoles: true,
          canManageAccount: true,
        },
      });

      await persistActivityLog(tx, {
        userId: currentUser.id,
        accountId: createdAccount.id,
        type: "ACCOUNT_CREATED",
        title: "Account created",
        description: `${currentUser.username} created ${createdAccount.name}`,
        metadata: {
          accountId: createdAccount.id,
          accountName: createdAccount.name,
          accountType: createdAccount.type,
          initialBalance: createdAccount.initialBalance,
          currency: createdAccount.currency,
        },
      });

      return createdAccount;
    });
  } catch {
    return {
      error: messages.failed,
      values,
    };
  }

  redirect(`/accounts/${account.id}/dashboard`);
}

export async function createAccountWithState(
  _previousState: CreateAccountState | null,
  formData: FormData
): Promise<CreateAccountState> {
  return createAccountFromForm(formData);
}

export async function createAccount(formData: FormData): Promise<void> {
  await createAccountFromForm(formData);
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
