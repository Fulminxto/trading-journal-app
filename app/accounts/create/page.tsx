import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import { createAccount } from "../actions";

type CreateAccountLabels = {
  eyebrow: string;
  title: string;
  description: string;
  accountNamePlaceholder: string;
  initialBalancePlaceholder: string;
  currencyPlaceholder: string;
  brokerPlaceholder: string;
  phasePlaceholder: string;
  profitTargetPlaceholder: string;
  maxDrawdownPlaceholder: string;
  dailyDrawdownPlaceholder: string;
  cancelButton: string;
  createButton: string;
};

const labels: Record<AppLanguage, CreateAccountLabels> =
  {
    en: {
      eyebrow: "Workspace",
      title: "Create Trading Account",
      description:
        "Create a new personal or shared trading account inside VOLTIS.",
      accountNamePlaceholder: "Account name",
      initialBalancePlaceholder: "Initial balance",
      currencyPlaceholder: "Currency",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Phase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Cancel",
      createButton: "Create Account",
    },
    it: {
      eyebrow: "Workspace",
      title: "Crea Account di Trading",
      description:
        "Crea un nuovo account di trading personale o condiviso in VOLTIS.",
      accountNamePlaceholder: "Nome account",
      initialBalancePlaceholder: "Saldo iniziale",
      currencyPlaceholder: "Valuta",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Fase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Annulla",
      createButton: "Crea Account",
    },
    uk: {
      eyebrow: "Workspace",
      title: "Створити торговий акаунт",
      description:
        "Створіть новий особистий або спільний торговий акаунт у VOLTIS.",
      accountNamePlaceholder: "Назва акаунту",
      initialBalancePlaceholder: "Початковий баланс",
      currencyPlaceholder: "Валюта",
      brokerPlaceholder: "Брокер / Prop Firm",
      phasePlaceholder: "Фаза",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Скасувати",
      createButton: "Створити акаунт",
    },
    ru: {
      eyebrow: "Workspace",
      title: "Создать торговый аккаунт",
      description:
        "Создайте новый личный или совместный торговый аккаунт в VOLTIS.",
      accountNamePlaceholder: "Название аккаунта",
      initialBalancePlaceholder: "Начальный баланс",
      currencyPlaceholder: "Валюта",
      brokerPlaceholder: "Брокер / Prop Firm",
      phasePlaceholder: "Фаза",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Отмена",
      createButton: "Создать аккаунт",
    },
    es: {
      eyebrow: "Workspace",
      title: "Crear cuenta de trading",
      description:
        "Crea una nueva cuenta de trading personal o compartida en VOLTIS.",
      accountNamePlaceholder: "Nombre de cuenta",
      initialBalancePlaceholder: "Saldo inicial",
      currencyPlaceholder: "Divisa",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Fase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Cancelar",
      createButton: "Crear cuenta",
    },
    fr: {
      eyebrow: "Workspace",
      title: "Créer un compte de trading",
      description:
        "Créez un nouveau compte de trading personnel ou partagé dans VOLTIS.",
      accountNamePlaceholder: "Nom du compte",
      initialBalancePlaceholder: "Solde initial",
      currencyPlaceholder: "Devise",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Phase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Annuler",
      createButton: "Créer le compte",
    },
    de: {
      eyebrow: "Workspace",
      title: "Trading-Konto erstellen",
      description:
        "Erstelle ein neues persönliches oder gemeinsames Trading-Konto in VOLTIS.",
      accountNamePlaceholder: "Kontoname",
      initialBalancePlaceholder: "Anfangssaldo",
      currencyPlaceholder: "Währung",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Phase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Abbrechen",
      createButton: "Konto erstellen",
    },
  };

export default async function CreateAccountPage() {
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

  const isGlobalAdmin =
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN";

  const canCreatePersonalAccount =
    isGlobalAdmin || currentUser.canCreatePersonalAccounts;

  const canCreateSharedAccount =
    isGlobalAdmin || currentUser.canCreateSharedAccounts;

  if (
    !canCreatePersonalAccount &&
    !canCreateSharedAccount
  ) {
    redirect("/accounts");
  }

  const language = normalizeAppLanguage(
    currentUser.appLanguage
  );
  const t = labels[language];

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-gray-400">
          {t.eyebrow}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {t.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-gray-400">
          {t.description}
        </p>
      </div>

      <form
        action={createAccount}
        className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2"
      >
        <input
          name="name"
          placeholder={t.accountNamePlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <select
          name="type"
          defaultValue={
            canCreatePersonalAccount ? "LIVE" : "SHARED"
          }
          aria-label="Account type"
          className="rounded-2xl bg-zinc-900 p-4"
          required
        >
          {canCreatePersonalAccount && (
            <>
              <option value="LIVE">LIVE</option>
              <option value="DEMO">DEMO</option>
              <option value="PROP">PROP</option>
              <option value="CHALLENGE">CHALLENGE</option>
              <option value="FUNDED">FUNDED</option>
            </>
          )}

          {canCreateSharedAccount && (
            <option value="SHARED">SHARED</option>
          )}
        </select>

        <input
          name="initialBalance"
          type="number"
          placeholder={t.initialBalancePlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <input
          name="currency"
          defaultValue="USD"
          placeholder={t.currencyPlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <input
          name="broker"
          placeholder={t.brokerPlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="phase"
          placeholder={t.phasePlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="profitTarget"
          type="number"
          step="0.01"
          placeholder={t.profitTargetPlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="maxDrawdown"
          type="number"
          step="0.01"
          placeholder={t.maxDrawdownPlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="dailyDrawdown"
          type="number"
          step="0.01"
          placeholder={t.dailyDrawdownPlaceholder}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <div className="flex gap-3 md:col-span-2">
          <Link
            href="/accounts"
            className="rounded-2xl bg-white/10 px-6 py-4 text-sm font-bold text-white hover:bg-white/20"
          >
            {t.cancelButton}
          </Link>

          <button
            type="submit"
            className="flex-1 rounded-2xl bg-green-500 px-6 py-4 text-sm font-bold text-black hover:bg-green-400"
          >
            {t.createButton}
          </button>
        </div>
      </form>
    </div>
  );
}
