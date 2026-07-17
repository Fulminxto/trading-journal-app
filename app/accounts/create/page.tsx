import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import CreateAccountForm from "./CreateAccountForm";

type CreateAccountLabels = {
  eyebrow: string;
  title: string;
  description: string;
  accountNamePlaceholder: string;
  accountTypeLabel: string;
  initialBalancePlaceholder: string;
  currencyPlaceholder: string;
  brokerPlaceholder: string;
  phasePlaceholder: string;
  profitTargetPlaceholder: string;
  maxDrawdownPlaceholder: string;
  dailyDrawdownPlaceholder: string;
  cancelButton: string;
  createButton: string;
  requiredLabel: string;
  optionalLabel: string;
  creatingLabel: string;
};

const labels: Record<AppLanguage, CreateAccountLabels> =
  {
    en: {
      eyebrow: "Workspace",
      title: "Create Trading Account",
      description:
        "Create a new personal or shared trading account inside VOLTIS.",
      accountNamePlaceholder: "Account name",
      accountTypeLabel: "Account type",
      initialBalancePlaceholder: "Initial balance",
      currencyPlaceholder: "Currency",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Phase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Cancel",
      createButton: "Create Account",
      requiredLabel: "Required",
      optionalLabel: "Optional",
      creatingLabel: "Creating account…",
    },
    it: {
      eyebrow: "Workspace",
      title: "Crea Account di Trading",
      description:
        "Crea un nuovo account di trading personale o condiviso in VOLTIS.",
      accountNamePlaceholder: "Nome account",
      accountTypeLabel: "Tipo di account",
      initialBalancePlaceholder: "Saldo iniziale",
      currencyPlaceholder: "Valuta",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Fase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Annulla",
      createButton: "Crea Account",
      requiredLabel: "Obbligatorio",
      optionalLabel: "Opzionale",
      creatingLabel: "Creazione account…",
    },
    uk: {
      eyebrow: "Workspace",
      title: "Створити торговий акаунт",
      description:
        "Створіть новий особистий або спільний торговий акаунт у VOLTIS.",
      accountNamePlaceholder: "Назва акаунту",
      accountTypeLabel: "Тип акаунту",
      initialBalancePlaceholder: "Початковий баланс",
      currencyPlaceholder: "Валюта",
      brokerPlaceholder: "Брокер / Prop Firm",
      phasePlaceholder: "Фаза",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Скасувати",
      createButton: "Створити акаунт",
      requiredLabel: "Обов’язково",
      optionalLabel: "Необов’язково",
      creatingLabel: "Створення акаунта…",
    },
    ru: {
      eyebrow: "Workspace",
      title: "Создать торговый аккаунт",
      description:
        "Создайте новый личный или совместный торговый аккаунт в VOLTIS.",
      accountNamePlaceholder: "Название аккаунта",
      accountTypeLabel: "Тип аккаунта",
      initialBalancePlaceholder: "Начальный баланс",
      currencyPlaceholder: "Валюта",
      brokerPlaceholder: "Брокер / Prop Firm",
      phasePlaceholder: "Фаза",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Отмена",
      createButton: "Создать аккаунт",
      requiredLabel: "Обязательно",
      optionalLabel: "Необязательно",
      creatingLabel: "Создание аккаунта…",
    },
    es: {
      eyebrow: "Workspace",
      title: "Crear cuenta de trading",
      description:
        "Crea una nueva cuenta de trading personal o compartida en VOLTIS.",
      accountNamePlaceholder: "Nombre de cuenta",
      accountTypeLabel: "Tipo de cuenta",
      initialBalancePlaceholder: "Saldo inicial",
      currencyPlaceholder: "Divisa",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Fase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Cancelar",
      createButton: "Crear cuenta",
      requiredLabel: "Obligatorio",
      optionalLabel: "Opcional",
      creatingLabel: "Creando cuenta…",
    },
    fr: {
      eyebrow: "Workspace",
      title: "Créer un compte de trading",
      description:
        "Créez un nouveau compte de trading personnel ou partagé dans VOLTIS.",
      accountNamePlaceholder: "Nom du compte",
      accountTypeLabel: "Type de compte",
      initialBalancePlaceholder: "Solde initial",
      currencyPlaceholder: "Devise",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Phase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Annuler",
      createButton: "Créer le compte",
      requiredLabel: "Obligatoire",
      optionalLabel: "Facultatif",
      creatingLabel: "Création du compte…",
    },
    de: {
      eyebrow: "Workspace",
      title: "Trading-Konto erstellen",
      description:
        "Erstelle ein neues persönliches oder gemeinsames Trading-Konto in VOLTIS.",
      accountNamePlaceholder: "Kontoname",
      accountTypeLabel: "Kontotyp",
      initialBalancePlaceholder: "Anfangssaldo",
      currencyPlaceholder: "Währung",
      brokerPlaceholder: "Broker / Prop Firm",
      phasePlaceholder: "Phase",
      profitTargetPlaceholder: "Profit Target %",
      maxDrawdownPlaceholder: "Max Drawdown %",
      dailyDrawdownPlaceholder: "Daily Drawdown %",
      cancelButton: "Abbrechen",
      createButton: "Konto erstellen",
      requiredLabel: "Erforderlich",
      optionalLabel: "Optional",
      creatingLabel: "Konto wird erstellt…",
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

      <CreateAccountForm
        canCreatePersonalAccount={canCreatePersonalAccount}
        canCreateSharedAccount={canCreateSharedAccount}
        labels={{
          accountName: t.accountNamePlaceholder,
          accountType: t.accountTypeLabel,
          initialBalance: t.initialBalancePlaceholder,
          currency: t.currencyPlaceholder,
          broker: t.brokerPlaceholder,
          phase: t.phasePlaceholder,
          profitTarget: t.profitTargetPlaceholder,
          maxDrawdown: t.maxDrawdownPlaceholder,
          dailyDrawdown: t.dailyDrawdownPlaceholder,
          required: t.requiredLabel,
          optional: t.optionalLabel,
          cancel: t.cancelButton,
          submit: t.createButton,
          pending: t.creatingLabel,
        }}
      />
    </div>
  );
}
