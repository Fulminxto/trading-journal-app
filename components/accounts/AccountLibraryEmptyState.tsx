import Link from "next/link";
import { FolderOpen } from "lucide-react";

import EmptyState from "@/components/EmptyState";
import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";

type EmptyLabels = {
  creatorTitle: string;
  creatorDescription: string;
  create: string;
  unavailableTitle: string;
  unavailableDescription: string;
  manage: string;
  archived: string;
};

const labels: Record<AppLanguage, EmptyLabels> = {
  en: { creatorTitle: "No active accounts", creatorDescription: "Create your first trading account to start using VOLTIS.", create: "Create account", unavailableTitle: "No accounts available", unavailableDescription: "You do not currently have access to an active trading account.", manage: "Manage accounts", archived: "View archived accounts" },
  it: { creatorTitle: "Nessun account attivo", creatorDescription: "Crea il tuo primo account di trading per iniziare a usare VOLTIS.", create: "Crea account", unavailableTitle: "Nessun account disponibile", unavailableDescription: "Al momento non hai accesso a un account di trading attivo.", manage: "Gestisci account", archived: "Visualizza account archiviati" },
  uk: { creatorTitle: "Немає активних акаунтів", creatorDescription: "Створіть свій перший торговий акаунт, щоб почати користуватися VOLTIS.", create: "Створити акаунт", unavailableTitle: "Немає доступних акаунтів", unavailableDescription: "Наразі у вас немає доступу до активного торгового акаунта.", manage: "Керувати акаунтами", archived: "Переглянути архівні акаунти" },
  ru: { creatorTitle: "Нет активных аккаунтов", creatorDescription: "Создайте свой первый торговый аккаунт, чтобы начать использовать VOLTIS.", create: "Создать аккаунт", unavailableTitle: "Нет доступных аккаунтов", unavailableDescription: "Сейчас у вас нет доступа к активному торговому аккаунту.", manage: "Управление аккаунтами", archived: "Просмотреть архивные аккаунты" },
  es: { creatorTitle: "No hay cuentas activas", creatorDescription: "Crea tu primera cuenta de trading para empezar a usar VOLTIS.", create: "Crear cuenta", unavailableTitle: "No hay cuentas disponibles", unavailableDescription: "Actualmente no tienes acceso a una cuenta de trading activa.", manage: "Gestionar cuentas", archived: "Ver cuentas archivadas" },
  fr: { creatorTitle: "Aucun compte actif", creatorDescription: "Créez votre premier compte de trading pour commencer à utiliser VOLTIS.", create: "Créer un compte", unavailableTitle: "Aucun compte disponible", unavailableDescription: "Vous n’avez actuellement accès à aucun compte de trading actif.", manage: "Gérer les comptes", archived: "Voir les comptes archivés" },
  de: { creatorTitle: "Keine aktiven Konten", creatorDescription: "Erstelle dein erstes Trading-Konto, um VOLTIS zu nutzen.", create: "Konto erstellen", unavailableTitle: "Keine Konten verfügbar", unavailableDescription: "Du hast derzeit keinen Zugriff auf ein aktives Trading-Konto.", manage: "Konten verwalten", archived: "Archivierte Konten anzeigen" },
};

export function getAccountLibraryEmptyState(language: string | null | undefined, availability: { canCreateAccount: boolean; canManageAccounts: boolean; hasArchivedAccounts: boolean }) {
  const t = labels[normalizeAppLanguage(language)];
  return {
    title: availability.canCreateAccount ? t.creatorTitle : t.unavailableTitle,
    description: availability.canCreateAccount ? t.creatorDescription : t.unavailableDescription,
    actions: [
      ...(availability.canCreateAccount ? [{ href: "/accounts/create", label: t.create, primary: true }] : []),
      ...(availability.canManageAccounts ? [{ href: "/accounts/manage", label: t.manage, primary: false }] : []),
      ...(availability.hasArchivedAccounts ? [{ href: "/accounts/archived", label: t.archived, primary: false }] : []),
    ],
  };
}

export default function AccountLibraryEmptyState(props: { language: string | null | undefined; canCreateAccount: boolean; canManageAccounts: boolean; hasArchivedAccounts: boolean }) {
  const state = getAccountLibraryEmptyState(props.language, props);
  return (
    <EmptyState
      icon={FolderOpen}
      title={state.title}
      description={state.description}
      action={state.actions.length > 0 ? <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">{state.actions.map((action) => <Link key={action.href} href={action.href} aria-label={action.label} className={`inline-flex min-h-11 items-center justify-center rounded-inner px-4 py-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${action.primary ? "bg-accent text-white" : "border-[0.5px] border-flash/[0.14] text-muted hover:bg-white/[0.04] hover:text-flash"}`}>{action.label}</Link>)}</div> : undefined}
    />
  );
}
