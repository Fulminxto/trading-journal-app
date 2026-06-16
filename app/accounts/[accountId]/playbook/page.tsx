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
    confirmYes: "SÃ¬, elimina",
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
    heading: "ÐŸÐ»ÐµÐ¹Ð±ÑƒÐº ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ð¹",
    subheading:
      "ÐšÐµÑ€ÑƒÐ¹Ñ‚Ðµ ÑÐ²Ð¾Ñ—Ð¼Ð¸ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð¸Ð¼Ð¸ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–ÑÐ¼Ð¸ Ñ‚Ð° Ð²Ñ–Ð´ÑÑ‚ÐµÐ¶ÑƒÐ¹Ñ‚Ðµ ÐµÑ„ÐµÐºÑ‚Ð¸Ð²Ð½Ñ–ÑÑ‚ÑŒ ÐºÐ¾Ð¶Ð½Ð¾Ñ—.",
    createSectionTitle: "ÐÐ¾Ð²Ð° ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ",
    namePlaceholder: "ÐÐ°Ð·Ð²Ð° ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ— (Ð½Ð°Ð¿Ñ€. ÐÐ·Ñ–Ð¹ÑÑŒÐºÐ¸Ð¹ Ð¿Ñ€Ð¾Ñ€Ð¸Ð²)",
    descriptionPlaceholder: "ÐžÐ¿Ð¸Ñ Ð°Ð±Ð¾ Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð° Ñ‚Ð¾Ñ€Ð³Ñ–Ð²Ð»Ñ– (Ð½ÐµÐ¾Ð±Ð¾Ð²'ÑÐ·ÐºÐ¾Ð²Ð¾)",
    colorLabel: "ÐšÐ¾Ð»Ñ–Ñ€",
    createButton: "Ð¡Ñ‚Ð²Ð¾Ñ€Ð¸Ñ‚Ð¸ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–ÑŽ",
    strategiesSectionTitle: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ—",
    noStrategies: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ð¹ Ñ‰Ðµ Ð½ÐµÐ¼Ð°Ñ”.",
    noStrategiesHint:
      "Ð¡Ñ‚Ð²Ð¾Ñ€Ñ–Ñ‚ÑŒ ÑÐ²Ð¾ÑŽ Ð¿ÐµÑ€ÑˆÑƒ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–ÑŽ, Ñ‰Ð¾Ð± Ð¿Ð¾Ñ‡Ð°Ñ‚Ð¸ Ð²Ñ–Ð´ÑÑ‚ÐµÐ¶ÑƒÐ²Ð°Ñ‚Ð¸ ÐµÑ„ÐµÐºÑ‚Ð¸Ð²Ð½Ñ–ÑÑ‚ÑŒ.",
    tradesLabel: "Ð£Ð³Ð¾Ð´Ð¸",
    winRateLabel: "Win Rate",
    totalPnlLabel: "Ð—Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¹ PnL",
    editButton: "Ð ÐµÐ´Ð°Ð³ÑƒÐ²Ð°Ñ‚Ð¸",
    saveButton: "Ð—Ð±ÐµÑ€ÐµÐ³Ñ‚Ð¸",
    deleteButton: "Ð’Ð¸Ð´Ð°Ð»Ð¸Ñ‚Ð¸",
    confirmDelete: "Ð’Ð¸Ð´Ð°Ð»Ð¸Ñ‚Ð¸ Ñ†ÑŽ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–ÑŽ?",
    confirmYes: "Ð¢Ð°Ðº, Ð²Ð¸Ð´Ð°Ð»Ð¸Ñ‚Ð¸",
    cancelConfirm: "Ð¡ÐºÐ°ÑÑƒÐ²Ð°Ñ‚Ð¸",
  },
  ru: {
    badge: "Playbook",
    heading: "ÐŸÐ»ÐµÐ¹Ð±ÑƒÐº ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¹",
    subheading:
      "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹Ñ‚Ðµ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ñ‹Ð¼Ð¸ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸ÑÐ¼Ð¸ Ð¸ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð¹Ñ‚Ðµ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ ÐºÐ°Ð¶Ð´Ð¾Ð¹.",
    createSectionTitle: "ÐÐ¾Ð²Ð°Ñ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ",
    namePlaceholder: "ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ (Ð½Ð°Ð¿Ñ€. ÐÐ·Ð¸Ð°Ñ‚ÑÐºÐ¸Ð¹ Ð¿Ñ€Ð¾Ñ€Ñ‹Ð²)",
    descriptionPlaceholder: "ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¸Ð»Ð¸ Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð° Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»Ð¸ (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)",
    colorLabel: "Ð¦Ð²ÐµÑ‚",
    createButton: "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸ÑŽ",
    strategiesSectionTitle: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸",
    noStrategies: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ‚.",
    noStrategiesHint:
      "Ð¡Ð¾Ð·Ð´Ð°Ð¹Ñ‚Ðµ Ð¿ÐµÑ€Ð²ÑƒÑŽ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸ÑŽ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð½Ð°Ñ‡Ð°Ñ‚ÑŒ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ñ‚ÑŒ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹.",
    tradesLabel: "Ð¡Ð´ÐµÐ»ÐºÐ¸",
    winRateLabel: "Win Rate",
    totalPnlLabel: "ÐžÐ±Ñ‰Ð¸Ð¹ PnL",
    editButton: "Ð ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ",
    saveButton: "Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ",
    deleteButton: "Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ",
    confirmDelete: "Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ ÑÑ‚Ñƒ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸ÑŽ?",
    confirmYes: "Ð”Ð°, ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ",
    cancelConfirm: "ÐžÑ‚Ð¼ÐµÐ½Ð°",
  },
  es: {
    badge: "Playbook",
    heading: "Playbook de estrategias",
    subheading:
      "Gestiona tus estrategias operativas y monitorea el rendimiento de cada una.",
    createSectionTitle: "Nueva estrategia",
    namePlaceholder: "Nombre de estrategia (ej. Breakout Asia)",
    descriptionPlaceholder: "DescripciÃ³n o reglas operativas (opcional)",
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
    confirmDelete: "Â¿Eliminar esta estrategia?",
    confirmYes: "SÃ­, eliminar",
    cancelConfirm: "Cancelar",
  },
  fr: {
    badge: "Playbook",
    heading: "Playbook des stratÃ©gies",
    subheading:
      "GÃ©rez vos stratÃ©gies de trading et suivez la performance de chacune.",
    createSectionTitle: "Nouvelle stratÃ©gie",
    namePlaceholder: "Nom de la stratÃ©gie (ex. Breakout Asie)",
    descriptionPlaceholder: "Description ou rÃ¨gles opÃ©rationnelles (optionnel)",
    colorLabel: "Couleur",
    createButton: "CrÃ©er la stratÃ©gie",
    strategiesSectionTitle: "StratÃ©gies",
    noStrategies: "Aucune stratÃ©gie crÃ©Ã©e.",
    noStrategiesHint:
      "CrÃ©ez votre premiÃ¨re stratÃ©gie pour commencer Ã  suivre les performances.",
    tradesLabel: "Trades",
    winRateLabel: "Win Rate",
    totalPnlLabel: "PnL total",
    editButton: "Modifier",
    saveButton: "Enregistrer",
    deleteButton: "Supprimer",
    confirmDelete: "Supprimer cette stratÃ©gie ?",
    confirmYes: "Oui, supprimer",
    cancelConfirm: "Annuler",
  },
  de: {
    badge: "Playbook",
    heading: "Strategie-Playbook",
    subheading:
      "Verwalten Sie Ihre Handelsstrategien und Ã¼berwachen Sie die Leistung jeder Strategie.",
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
    deleteButton: "LÃ¶schen",
    confirmDelete: "Diese Strategie lÃ¶schen?",
    confirmYes: "Ja, lÃ¶schen",
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
                        {winRate !== null ? `${winRate}%` : "â€”"}
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
                          : "â€”"}
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
