import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeAppLanguage,
  formatCurrencyByLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { CreateStrategyForm, StrategyCardActions } from "./strategy-form";
import type { StrategyFormLabels } from "./strategy-form";

type PlaybookLabels = StrategyFormLabels & {
  badge: string;
  heading: string;
  subheading: string;
  createSectionTitle: string;
  strategiesSectionTitle: string;
  noStrategies: string;
  noStrategiesHint: string;
  tradesLabel: string;
  winRateLabel: string;
  totalPnlLabel: string;
};

const pageLabels: Record<AppLanguage, PlaybookLabels> = {
  it: {
    badge: "Playbook",
    heading: "Playbook strategie",
    subheading:
      "Gestisci le tue strategie operative e monitora le performance per ciascuna.",
    createSectionTitle: "Nuova strategia",
    namePlaceholder: "Nome strategia (es. Breakout Asia)",
    descriptionPlaceholder: "Descrizione o regole operative (opzionale)",
    colorLabel: "Colore",
    createButton: "Crea strategia",
    strategiesSectionTitle: "Le strategie",
    noStrategies: "Nessuna strategia creata.",
    noStrategiesHint:
      "Crea la tua prima strategia per iniziare a tracciare le performance.",
    tradesLabel: "Trade",
    winRateLabel: "Win Rate",
    totalPnlLabel: "PnL totale",
    editButton: "Modifica",
    saveButton: "Salva",
    deleteButton: "Elimina",
    confirmDelete: "Eliminare questa strategia?",
    confirmYes: "Sì, elimina",
    cancelConfirm: "Annulla",
  },
  en: {
    badge: "Playbook",
    heading: "Strategy Playbook",
    subheading:
      "Manage your trading strategies and monitor performance for each one.",
    createSectionTitle: "New strategy",
    namePlaceholder: "Strategy name (e.g. Asia Breakout)",
    descriptionPlaceholder: "Description or trading rules (optional)",
    colorLabel: "Color",
    createButton: "Create strategy",
    strategiesSectionTitle: "Strategies",
    noStrategies: "No strategies created yet.",
    noStrategiesHint:
      "Create your first strategy to start tracking performance.",
    tradesLabel: "Trades",
    winRateLabel: "Win Rate",
    totalPnlLabel: "Total PnL",
    editButton: "Edit",
    saveButton: "Save",
    deleteButton: "Delete",
    confirmDelete: "Delete this strategy?",
    confirmYes: "Yes, delete",
    cancelConfirm: "Cancel",
  },
  uk: {
    badge: "Playbook",
    heading: "Плейбук стратегій",
    subheading:
      "Керуйте своїми торговими стратегіями та відстежуйте ефективність кожної.",
    createSectionTitle: "Нова стратегія",
    namePlaceholder: "Назва стратегії (напр. Азійський прорив)",
    descriptionPlaceholder: "Опис або правила торгівлі (необов'язково)",
    colorLabel: "Колір",
    createButton: "Створити стратегію",
    strategiesSectionTitle: "Стратегії",
    noStrategies: "Стратегій ще немає.",
    noStrategiesHint:
      "Створіть свою першу стратегію, щоб почати відстежувати ефективність.",
    tradesLabel: "Угоди",
    winRateLabel: "Win Rate",
    totalPnlLabel: "Загальний PnL",
    editButton: "Редагувати",
    saveButton: "Зберегти",
    deleteButton: "Видалити",
    confirmDelete: "Видалити цю стратегію?",
    confirmYes: "Так, видалити",
    cancelConfirm: "Скасувати",
  },
  ru: {
    badge: "Playbook",
    heading: "Плейбук стратегий",
    subheading:
      "Управляйте торговыми стратегиями и отслеживайте эффективность каждой.",
    createSectionTitle: "Новая стратегия",
    namePlaceholder: "Название стратегии (напр. Азиатский прорыв)",
    descriptionPlaceholder: "Описание или правила торговли (опционально)",
    colorLabel: "Цвет",
    createButton: "Создать стратегию",
    strategiesSectionTitle: "Стратегии",
    noStrategies: "Стратегий пока нет.",
    noStrategiesHint:
      "Создайте первую стратегию, чтобы начать отслеживать результаты.",
    tradesLabel: "Сделки",
    winRateLabel: "Win Rate",
    totalPnlLabel: "Общий PnL",
    editButton: "Редактировать",
    saveButton: "Сохранить",
    deleteButton: "Удалить",
    confirmDelete: "Удалить эту стратегию?",
    confirmYes: "Да, удалить",
    cancelConfirm: "Отмена",
  },
  es: {
    badge: "Playbook",
    heading: "Playbook de estrategias",
    subheading:
      "Gestiona tus estrategias operativas y monitorea el rendimiento de cada una.",
    createSectionTitle: "Nueva estrategia",
    namePlaceholder: "Nombre de estrategia (ej. Breakout Asia)",
    descriptionPlaceholder: "Descripción o reglas operativas (opcional)",
    colorLabel: "Color",
    createButton: "Crear estrategia",
    strategiesSectionTitle: "Estrategias",
    noStrategies: "No hay estrategias creadas.",
    noStrategiesHint:
      "Crea tu primera estrategia para empezar a rastrear el rendimiento.",
    tradesLabel: "Trades",
    winRateLabel: "Win Rate",
    totalPnlLabel: "PnL total",
    editButton: "Editar",
    saveButton: "Guardar",
    deleteButton: "Eliminar",
    confirmDelete: "¿Eliminar esta estrategia?",
    confirmYes: "Sí, eliminar",
    cancelConfirm: "Cancelar",
  },
  fr: {
    badge: "Playbook",
    heading: "Playbook des stratégies",
    subheading:
      "Gérez vos stratégies de trading et suivez la performance de chacune.",
    createSectionTitle: "Nouvelle stratégie",
    namePlaceholder: "Nom de la stratégie (ex. Breakout Asie)",
    descriptionPlaceholder: "Description ou règles opérationnelles (optionnel)",
    colorLabel: "Couleur",
    createButton: "Créer la stratégie",
    strategiesSectionTitle: "Stratégies",
    noStrategies: "Aucune stratégie créée.",
    noStrategiesHint:
      "Créez votre première stratégie pour commencer à suivre les performances.",
    tradesLabel: "Trades",
    winRateLabel: "Win Rate",
    totalPnlLabel: "PnL total",
    editButton: "Modifier",
    saveButton: "Enregistrer",
    deleteButton: "Supprimer",
    confirmDelete: "Supprimer cette stratégie ?",
    confirmYes: "Oui, supprimer",
    cancelConfirm: "Annuler",
  },
  de: {
    badge: "Playbook",
    heading: "Strategie-Playbook",
    subheading:
      "Verwalten Sie Ihre Handelsstrategien und überwachen Sie die Leistung jeder Strategie.",
    createSectionTitle: "Neue Strategie",
    namePlaceholder: "Strategiename (z.B. Asien-Breakout)",
    descriptionPlaceholder: "Beschreibung oder Handelsregeln (optional)",
    colorLabel: "Farbe",
    createButton: "Strategie erstellen",
    strategiesSectionTitle: "Strategien",
    noStrategies: "Noch keine Strategien erstellt.",
    noStrategiesHint:
      "Erstellen Sie Ihre erste Strategie, um die Leistung zu verfolgen.",
    tradesLabel: "Trades",
    winRateLabel: "Win Rate",
    totalPnlLabel: "Gesamt-PnL",
    editButton: "Bearbeiten",
    saveButton: "Speichern",
    deleteButton: "Löschen",
    confirmDelete: "Diese Strategie löschen?",
    confirmYes: "Ja, löschen",
    cancelConfirm: "Abbrechen",
  },
};

type StratStats = { count: number; wins: number; totalPnl: number };

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.accountMember.findFirst({
    where: { userId: session.user.id, tradingAccountId: accountId },
    include: {
      user: { select: { appLanguage: true } },
      tradingAccount: { select: { name: true, currency: true } },
    },
  });
  if (!membership) redirect("/accounts");

  const language = normalizeAppLanguage(membership.user.appLanguage);
  const t = pageLabels[language];
  const currency = membership.tradingAccount.currency ?? "USD";
  const canManageStrategies =
    membership.role === "MANAGER" || membership.canCreateTrades;

  const strategies = await prisma.strategy.findMany({
    where: { tradingAccountId: accountId },
    orderBy: { createdAt: "asc" },
  });

  const linkedTrades = await prisma.trade.findMany({
    where: { tradingAccountId: accountId, strategyId: { not: null } },
    select: { strategyId: true, outcome: true, resultUsd: true },
  });

  const statsMap: Record<string, StratStats> = {};
  for (const trade of linkedTrades) {
    if (!trade.strategyId) continue;
    const s = statsMap[trade.strategyId] ?? { count: 0, wins: 0, totalPnl: 0 };
    s.count += 1;
    if (trade.outcome === "win") s.wins += 1;
    s.totalPnl += trade.resultUsd ?? 0;
    statsMap[trade.strategyId] = s;
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.10),transparent_40%)]" />
        <div className="relative z-10">
          <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
            {t.badge}
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {t.heading}
          </h1>
          <p className="mt-3 text-sm text-gray-400">{t.subheading}</p>
        </div>
      </section>

      {/* Create form */}
      {canManageStrategies && (
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-gray-500">
            {t.createSectionTitle}
          </p>
          <CreateStrategyForm accountId={accountId} t={t} />
        </section>
      )}

      {/* Strategy list */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-gray-500">
          {t.strategiesSectionTitle}
        </p>

        {strategies.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-8 text-center">
            <p className="font-bold text-white">{t.noStrategies}</p>
            <p className="mt-2 text-sm text-gray-500">{t.noStrategiesHint}</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {strategies.map((strategy) => {
              const stats = statsMap[strategy.id] ?? {
                count: 0,
                wins: 0,
                totalPnl: 0,
              };
              const winRate =
                stats.count > 0
                  ? Math.round((stats.wins / stats.count) * 100)
                  : null;

              return (
                <div
                  key={strategy.id}
                  className="rounded-3xl border border-white/10 bg-black/10 p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 flex-shrink-0 rounded-full"
                      style={{
                        backgroundColor: strategy.color ?? "#6b7280",
                      }}
                    />
                    <h3 className="truncate text-lg font-black text-white">
                      {strategy.name}
                    </h3>
                  </div>

                  {strategy.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                      {strategy.description}
                    </p>
                  )}

                  <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div>
                      <p className="text-[11px] text-gray-500">
                        {t.tradesLabel}
                      </p>
                      <p className="mt-1 text-base font-black text-white">
                        {stats.count}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500">
                        {t.winRateLabel}
                      </p>
                      <p
                        className={`mt-1 text-base font-black ${
                          winRate === null
                            ? "text-gray-500"
                            : winRate >= 50
                              ? "text-green-400"
                              : "text-yellow-400"
                        }`}
                      >
                        {winRate !== null ? `${winRate}%` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500">
                        {t.totalPnlLabel}
                      </p>
                      <p
                        className={`mt-1 text-base font-black ${
                          stats.count === 0
                            ? "text-gray-500"
                            : stats.totalPnl >= 0
                              ? "text-green-400"
                              : "text-red-400"
                        }`}
                      >
                        {stats.count > 0
                          ? formatCurrencyByLanguage(
                              stats.totalPnl,
                              currency,
                              language
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {canManageStrategies && (
                    <StrategyCardActions
                      key={`${strategy.id}-${strategy.updatedAt.getTime()}`}
                      accountId={accountId}
                      strategyId={strategy.id}
                      currentName={strategy.name}
                      currentDescription={strategy.description}
                      currentColor={strategy.color}
                      t={t}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
