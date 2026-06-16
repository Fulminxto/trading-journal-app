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
      title: "Ð¡Ñ‚Ð²Ð¾Ñ€Ð¸Ñ‚Ð¸ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð¸Ð¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚",
      description:
        "Ð¡Ñ‚Ð²Ð¾Ñ€Ñ–Ñ‚ÑŒ Ð½Ð¾Ð²Ð¸Ð¹ Ð¾ÑÐ¾Ð±Ð¸ÑÑ‚Ð¸Ð¹ Ð°Ð±Ð¾ ÑÐ¿Ñ–Ð»ÑŒÐ½Ð¸Ð¹ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð¸Ð¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ñƒ VOLTIS.",
      accountNamePlaceholder: "ÐÐ°Ð·Ð²Ð° Ð°ÐºÐ°ÑƒÐ½Ñ‚Ñƒ",
      initialBalancePlaceholder: "ÐŸÐ¾Ñ‡Ð°Ñ‚ÐºÐ¾Ð²Ð¸Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ",
      currencyPlaceholder: "Ð’Ð°Ð»ÑŽÑ‚Ð°",
      brokerPlaceholder: "Ð‘Ñ€Ð¾ÐºÐµÑ€ / Prop Firm",
      phasePlaceholder: "Ð¤Ð°Ð·Ð°",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Ð¡ÐºÐ°ÑÑƒÐ²Ð°Ñ‚Ð¸",
      createButton: "Ð¡Ñ‚Ð²Ð¾Ñ€Ð¸Ñ‚Ð¸ Ð°ÐºÐ°ÑƒÐ½Ñ‚",
    },
    ru: {
      eyebrow: "Workspace",
      title: "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ñ‹Ð¹ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚",
      description:
        "Ð¡Ð¾Ð·Ð´Ð°Ð¹Ñ‚Ðµ Ð½Ð¾Ð²Ñ‹Ð¹ Ð»Ð¸Ñ‡Ð½Ñ‹Ð¹ Ð¸Ð»Ð¸ ÑÐ¾Ð²Ð¼ÐµÑÑ‚Ð½Ñ‹Ð¹ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ñ‹Ð¹ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð² VOLTIS.",
      accountNamePlaceholder: "ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
      initialBalancePlaceholder: "ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ",
      currencyPlaceholder: "Ð’Ð°Ð»ÑŽÑ‚Ð°",
      brokerPlaceholder: "Ð‘Ñ€Ð¾ÐºÐµÑ€ / Prop Firm",
      phasePlaceholder: "Ð¤Ð°Ð·Ð°",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "ÐžÑ‚Ð¼ÐµÐ½Ð°",
      createButton: "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚",
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
      title: "CrÃ©er un compte de trading",
      description:
        "CrÃ©ez un nouveau compte de trading personnel ou partagÃ© dans VOLTIS.",
      accountNamePlaceholder: "Nom du compte",
      initialBalancePlaceholder: "Solde initial",
      currencyPlaceholder: "Devise",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Phase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Annuler",
      createButton: "CrÃ©er le compte",
    },
    de: {
      eyebrow: "Workspace",
      title: "Trading-Konto erstellen",
      description:
        "Erstelle ein neues persÃ¶nliches oder gemeinsames Trading-Konto in VOLTIS.",
      accountNamePlaceholder: "Kontoname",
      initialBalancePlaceholder: "Anfangssaldo",
      currencyPlaceholder: "WÃ¤hrung",
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
            className="flex-1 rounded-2xl bg-accent px-6 py-4 text-sm font-bold text-white hover:bg-accent-bright"
          >
            {t.createButton}
          </button>
        </div>
      </form>
    </div>
  );
}
