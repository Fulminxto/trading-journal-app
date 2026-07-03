import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  normalizeAppLanguage,
  formatCurrencyByLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { ArrowLeft, Pencil } from "lucide-react";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReplayLabels = {
  backToDiary: string;
  editTrade: string;
  badge: string;
  openTrade: string;
  long: string;
  short: string;
  win: string;
  loss: string;
  be: string;
  actSetupTitle: string;
  actTradeTitle: string;
  actOutcomeTitle: string;
  anatomyTitle: string;
  timelineTitle: string;
  performanceTitle: string;
  costsLabel: string;
  entryLabel: string;
  exitLabel: string;
  slLabel: string;
  tpLabel: string;
  noPriceData: string;
  openDate: string;
  closeDate: string;
  duration: string;
  session: string;
  daysAbbr: string;
  hoursAbbr: string;
  minsAbbr: string;
  plannedRR: string;
  actualRR: string;
  resultUsd: string;
  resultPct: string;
  commission: string;
  swap: string;
  fees: string;
  equityAfter: string;
  noData: string;
  strategyLabel: string;
  reasonLabel: string;
  setupQualityLabel: string;
  executionTitle: string;
  executionRatingLabel: string;
  confidenceLabel: string;
  emotionalStateLabel: string;
  calm: string;
  focused: string;
  confident: string;
  tired: string;
  stressed: string;
  impulsive: string;
  reviewTitle: string;
  mistakesLabel: string;
  lessonsLabel: string;
  notesLabel: string;
};

const pageLabels: Record<AppLanguage, ReplayLabels> = {
  it: {
    backToDiary: "Torna al diary",
    editTrade: "Modifica",
    badge: "Trade Replay",
    openTrade: "Trade aperto",
    long: "LONG",
    short: "SHORT",
    win: "WIN",
    loss: "LOSS",
    be: "Break Even",
    actSetupTitle: "Il piano",
    actTradeTitle: "L'operazione",
    actOutcomeTitle: "L'esito",
    anatomyTitle: "Anatomia del prezzo",
    timelineTitle: "Timeline",
    performanceTitle: "Risultato",
    costsLabel: "Costi & equity",
    entryLabel: "ENTRATA",
    exitLabel: "USCITA",
    slLabel: "SL",
    tpLabel: "TP",
    noPriceData: "Dati di prezzo non disponibili",
    openDate: "Apertura",
    closeDate: "Chiusura",
    duration: "Durata",
    session: "Sessione",
    daysAbbr: "g",
    hoursAbbr: "h",
    minsAbbr: "m",
    plannedRR: "R:R pianificato",
    actualRR: "R:R reale",
    resultUsd: "Risultato",
    resultPct: "Risultato %",
    commission: "Commissione",
    swap: "Swap",
    fees: "Fees",
    equityAfter: "Equity post-trade",
    noData: "—",
    strategyLabel: "Strategia",
    reasonLabel: "Motivazione",
    setupQualityLabel: "Qualità del setup",
    executionTitle: "Esecuzione & Psicologia",
    executionRatingLabel: "Qualità esecuzione",
    confidenceLabel: "Confidenza",
    emotionalStateLabel: "Stato emotivo",
    calm: "Calmo",
    focused: "Focalizzato",
    confident: "Fiducioso",
    tired: "Stanco",
    stressed: "Stressato",
    impulsive: "Impulsivo",
    reviewTitle: "Review",
    mistakesLabel: "Errori",
    lessonsLabel: "Lezioni apprese",
    notesLabel: "Note",
  },
  en: {
    backToDiary: "Back to Diary",
    editTrade: "Edit",
    badge: "Trade Replay",
    openTrade: "Open trade",
    long: "LONG",
    short: "SHORT",
    win: "WIN",
    loss: "LOSS",
    be: "Break Even",
    actSetupTitle: "The Plan",
    actTradeTitle: "The Trade",
    actOutcomeTitle: "The Outcome",
    anatomyTitle: "Price Anatomy",
    timelineTitle: "Timeline",
    performanceTitle: "Result",
    costsLabel: "Costs & Equity",
    entryLabel: "ENTRY",
    exitLabel: "EXIT",
    slLabel: "SL",
    tpLabel: "TP",
    noPriceData: "Price data not available",
    openDate: "Opened",
    closeDate: "Closed",
    duration: "Duration",
    session: "Session",
    daysAbbr: "d",
    hoursAbbr: "h",
    minsAbbr: "m",
    plannedRR: "Planned R:R",
    actualRR: "Actual R:R",
    resultUsd: "Result",
    resultPct: "Result %",
    commission: "Commission",
    swap: "Swap",
    fees: "Fees",
    equityAfter: "Equity after",
    noData: "—",
    strategyLabel: "Strategy",
    reasonLabel: "Motivation",
    setupQualityLabel: "Setup quality",
    executionTitle: "Execution & Psychology",
    executionRatingLabel: "Execution quality",
    confidenceLabel: "Confidence",
    emotionalStateLabel: "Emotional state",
    calm: "Calm",
    focused: "Focused",
    confident: "Confident",
    tired: "Tired",
    stressed: "Stressed",
    impulsive: "Impulsive",
    reviewTitle: "Review",
    mistakesLabel: "Mistakes",
    lessonsLabel: "Lessons learned",
    notesLabel: "Notes",
  },
  uk: {
    backToDiary: "До щоденника",
    editTrade: "Редагувати",
    badge: "Trade Replay",
    openTrade: "Відкрита угода",
    long: "LONG",
    short: "SHORT",
    win: "WIN",
    loss: "LOSS",
    be: "Беззбитково",
    actSetupTitle: "План",
    actTradeTitle: "Угода",
    actOutcomeTitle: "Результат",
    anatomyTitle: "Анатомія ціни",
    timelineTitle: "Хронологія",
    performanceTitle: "Результат",
    costsLabel: "Витрати та Equity",
    entryLabel: "ВХІД",
    exitLabel: "ВИХІД",
    slLabel: "SL",
    tpLabel: "TP",
    noPriceData: "Дані про ціни недоступні",
    openDate: "Відкрито",
    closeDate: "Закрито",
    duration: "Тривалість",
    session: "Сесія",
    daysAbbr: "д",
    hoursAbbr: "г",
    minsAbbr: "хв",
    plannedRR: "Плановий R:R",
    actualRR: "Реальний R:R",
    resultUsd: "Результат",
    resultPct: "Результат %",
    commission: "Комісія",
    swap: "Своп",
    fees: "Збори",
    equityAfter: "Equity після",
    noData: "—",
    strategyLabel: "Стратегія",
    reasonLabel: "Мотивація",
    setupQualityLabel: "Якість налаштування",
    executionTitle: "Виконання та психологія",
    executionRatingLabel: "Якість виконання",
    confidenceLabel: "Впевненість",
    emotionalStateLabel: "Емоційний стан",
    calm: "Спокійний",
    focused: "Зосереджений",
    confident: "Впевнений",
    tired: "Втомлений",
    stressed: "Напружений",
    impulsive: "Імпульсивний",
    reviewTitle: "Огляд",
    mistakesLabel: "Помилки",
    lessonsLabel: "Засвоєні уроки",
    notesLabel: "Нотатки",
  },
  ru: {
    backToDiary: "К дневнику",
    editTrade: "Редактировать",
    badge: "Trade Replay",
    openTrade: "Открытая сделка",
    long: "LONG",
    short: "SHORT",
    win: "WIN",
    loss: "LOSS",
    be: "Безубыток",
    actSetupTitle: "План",
    actTradeTitle: "Сделка",
    actOutcomeTitle: "Итог",
    anatomyTitle: "Анатомия цены",
    timelineTitle: "Хронология",
    performanceTitle: "Результат",
    costsLabel: "Издержки и Equity",
    entryLabel: "ВХОД",
    exitLabel: "ВЫХОД",
    slLabel: "SL",
    tpLabel: "TP",
    noPriceData: "Ценовые данные недоступны",
    openDate: "Открыто",
    closeDate: "Закрыто",
    duration: "Длительность",
    session: "Сессия",
    daysAbbr: "д",
    hoursAbbr: "ч",
    minsAbbr: "мин",
    plannedRR: "Плановый R:R",
    actualRR: "Реальный R:R",
    resultUsd: "Результат",
    resultPct: "Результат %",
    commission: "Комиссия",
    swap: "Своп",
    fees: "Сборы",
    equityAfter: "Equity после",
    noData: "—",
    strategyLabel: "Стратегия",
    reasonLabel: "Мотивация",
    setupQualityLabel: "Качество сетапа",
    executionTitle: "Исполнение и психология",
    executionRatingLabel: "Качество исполнения",
    confidenceLabel: "Уверенность",
    emotionalStateLabel: "Эмоциональное состояние",
    calm: "Спокойный",
    focused: "Сосредоточенный",
    confident: "Уверенный",
    tired: "Уставший",
    stressed: "Напряжённый",
    impulsive: "Импульсивный",
    reviewTitle: "Анализ",
    mistakesLabel: "Ошибки",
    lessonsLabel: "Извлечённые уроки",
    notesLabel: "Заметки",
  },
  es: {
    backToDiary: "Volver al diario",
    editTrade: "Editar",
    badge: "Trade Replay",
    openTrade: "Trade abierto",
    long: "LONG",
    short: "SHORT",
    win: "WIN",
    loss: "LOSS",
    be: "Sin resultado",
    actSetupTitle: "El plan",
    actTradeTitle: "La operación",
    actOutcomeTitle: "El resultado",
    anatomyTitle: "Anatomía del precio",
    timelineTitle: "Cronología",
    performanceTitle: "Resultado",
    costsLabel: "Costos y equity",
    entryLabel: "ENTRADA",
    exitLabel: "SALIDA",
    slLabel: "SL",
    tpLabel: "TP",
    noPriceData: "Datos de precio no disponibles",
    openDate: "Apertura",
    closeDate: "Cierre",
    duration: "Duración",
    session: "Sesión",
    daysAbbr: "d",
    hoursAbbr: "h",
    minsAbbr: "m",
    plannedRR: "R:R planificado",
    actualRR: "R:R real",
    resultUsd: "Resultado",
    resultPct: "Resultado %",
    commission: "Comisión",
    swap: "Swap",
    fees: "Tasas",
    equityAfter: "Equity después",
    noData: "—",
    strategyLabel: "Estrategia",
    reasonLabel: "Motivación",
    setupQualityLabel: "Calidad del setup",
    executionTitle: "Ejecución y psicología",
    executionRatingLabel: "Calidad de ejecución",
    confidenceLabel: "Confianza",
    emotionalStateLabel: "Estado emocional",
    calm: "Tranquilo",
    focused: "Enfocado",
    confident: "Confiado",
    tired: "Cansado",
    stressed: "Estresado",
    impulsive: "Impulsivo",
    reviewTitle: "Revisión",
    mistakesLabel: "Errores",
    lessonsLabel: "Lecciones aprendidas",
    notesLabel: "Notas",
  },
  fr: {
    backToDiary: "Retour au journal",
    editTrade: "Modifier",
    badge: "Trade Replay",
    openTrade: "Trade ouvert",
    long: "LONG",
    short: "SHORT",
    win: "WIN",
    loss: "LOSS",
    be: "Sans résultat",
    actSetupTitle: "Le plan",
    actTradeTitle: "L'opération",
    actOutcomeTitle: "Le résultat",
    anatomyTitle: "Anatomie du prix",
    timelineTitle: "Chronologie",
    performanceTitle: "Résultat",
    costsLabel: "Coûts et equity",
    entryLabel: "ENTRÉE",
    exitLabel: "SORTIE",
    slLabel: "SL",
    tpLabel: "TP",
    noPriceData: "Données de prix non disponibles",
    openDate: "Ouverture",
    closeDate: "Clôture",
    duration: "Durée",
    session: "Session",
    daysAbbr: "j",
    hoursAbbr: "h",
    minsAbbr: "m",
    plannedRR: "R:R planifié",
    actualRR: "R:R réel",
    resultUsd: "Résultat",
    resultPct: "Résultat %",
    commission: "Commission",
    swap: "Swap",
    fees: "Frais",
    equityAfter: "Equity après",
    noData: "—",
    strategyLabel: "Stratégie",
    reasonLabel: "Motivation",
    setupQualityLabel: "Qualité du setup",
    executionTitle: "Exécution & psychologie",
    executionRatingLabel: "Qualité d'exécution",
    confidenceLabel: "Confiance",
    emotionalStateLabel: "État émotionnel",
    calm: "Calme",
    focused: "Concentré",
    confident: "Confiant",
    tired: "Fatigué",
    stressed: "Stressé",
    impulsive: "Impulsif",
    reviewTitle: "Bilan",
    mistakesLabel: "Erreurs",
    lessonsLabel: "Leçons apprises",
    notesLabel: "Notes",
  },
  de: {
    backToDiary: "Zurück zum Tagebuch",
    editTrade: "Bearbeiten",
    badge: "Trade Replay",
    openTrade: "Offener Trade",
    long: "LONG",
    short: "SHORT",
    win: "WIN",
    loss: "LOSS",
    be: "Break Even",
    actSetupTitle: "Der Plan",
    actTradeTitle: "Der Trade",
    actOutcomeTitle: "Das Ergebnis",
    anatomyTitle: "Preisanatomie",
    timelineTitle: "Zeitverlauf",
    performanceTitle: "Ergebnis",
    costsLabel: "Kosten & Equity",
    entryLabel: "EINSTIEG",
    exitLabel: "AUSSTIEG",
    slLabel: "SL",
    tpLabel: "TP",
    noPriceData: "Preisdaten nicht verfügbar",
    openDate: "Eröffnet",
    closeDate: "Geschlossen",
    duration: "Dauer",
    session: "Session",
    daysAbbr: "T",
    hoursAbbr: "h",
    minsAbbr: "m",
    plannedRR: "Geplantes R:R",
    actualRR: "Reales R:R",
    resultUsd: "Ergebnis",
    resultPct: "Ergebnis %",
    commission: "Provision",
    swap: "Swap",
    fees: "Gebühren",
    equityAfter: "Equity danach",
    noData: "—",
    strategyLabel: "Strategie",
    reasonLabel: "Motivation",
    setupQualityLabel: "Setup-Qualität",
    executionTitle: "Ausführung & Psychologie",
    executionRatingLabel: "Ausführungsqualität",
    confidenceLabel: "Vertrauen",
    emotionalStateLabel: "Emotionaler Zustand",
    calm: "Ruhig",
    focused: "Fokussiert",
    confident: "Selbstsicher",
    tired: "Müde",
    stressed: "Gestresst",
    impulsive: "Impulsiv",
    reviewTitle: "Auswertung",
    mistakesLabel: "Fehler",
    lessonsLabel: "Gelernte Lektionen",
    notesLabel: "Notizen",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(p: number): string {
  const a = Math.abs(p);
  if (a >= 10000) return p.toFixed(1);
  if (a >= 100) return p.toFixed(2);
  if (a >= 10) return p.toFixed(3);
  return p.toFixed(5);
}

function pctFromEntry(price: number, entry: number): string {
  if (entry === 0) return "0.00%";
  const v = ((price - entry) / Math.abs(entry)) * 100;
  return (v >= 0 ? "+" : "") + v.toFixed(2) + "%";
}

function calcDuration(open: Date, close: Date | null, t: ReplayLabels): string {
  if (!close) return t.openTrade;
  const ms = close.getTime() - open.getTime();
  if (ms < 0) return t.noData;
  const totalMins = Math.floor(ms / 60_000);
  if (totalMins < 1) return `< 1${t.minsAbbr}`;
  const d = Math.floor(totalMins / 1440);
  const h = Math.floor((totalMins % 1440) / 60);
  const m = totalMins % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}${t.daysAbbr}`);
  if (h > 0) parts.push(`${h}${t.hoursAbbr}`);
  if (m > 0 || parts.length === 0) parts.push(`${m}${t.minsAbbr}`);
  return parts.join(" ");
}

function computeActualRR(
  entry: number | null,
  exit: number | null,
  sl: number | null,
  outcome: string | null,
): number | null {
  if (!entry || !exit || !sl) return null;
  const risk = Math.abs(entry - sl);
  if (risk === 0) return null;
  const move = Math.abs(exit - entry);
  if (outcome === "loss") return -(move / risk);
  if (outcome === "be") return 0;
  return move / risk;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeHM(d: Date): string {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalizeSession(s: string | null): string {
  if (!s) return "";
  return s
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Emotional state is a distinguishing label, not a P&L outcome - stays in
// the cold family per REBRAND_BLUEPRINT.md's "colore-etichetta" rule
// rather than the calm=blue/stressed=orange/impulsive=red rainbow this
// used to be.
const EMOTION_PILL_CLASS = "border-white/10 bg-white/[0.05] text-white";

function emotionLabel(state: string, t: ReplayLabels): string {
  const lower = state.toLowerCase();
  if (lower === "calm") return t.calm;
  if (lower === "focused") return t.focused;
  if (lower === "confident") return t.confident;
  if (lower === "tired") return t.tired;
  if (lower === "stressed") return t.stressed;
  if (lower === "impulsive") return t.impulsive;
  return state;
}

// ─── Small building blocks ─────────────────────────────────────────────────────

function ActHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-black text-accent-bright">
        {number}
      </span>
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
        {title}
      </h2>
    </div>
  );
}

function SubCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-black uppercase tracking-[0.15em] text-muted-faint">
      {children}
    </p>
  );
}

// ─── SVG Price Anatomy ────────────────────────────────────────────────────────

function PriceAnatomySVG({
  entry,
  exit,
  sl,
  tp,
  outcome,
  t,
}: {
  entry: number | null;
  exit: number | null;
  sl: number | null;
  tp: number | null;
  outcome: string | null;
  t: ReplayLabels;
}) {
  if (!entry) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-faint">
        {t.noPriceData}
      </div>
    );
  }

  const rawPrices = [entry, exit, sl, tp].filter((p): p is number => p !== null);
  const minP = Math.min(...rawPrices);
  const maxP = Math.max(...rawPrices);
  const rawRange = maxP - minP || Math.abs(entry) * 0.005 || 1;
  const pad = rawRange * 0.22;
  const lo = minP - pad;
  const hi = maxP + pad;
  const range = hi - lo;

  const W = 360;
  const H = 240;
  const lx = 92;
  const rx = 268;
  const dw = rx - lx;

  const toY = (p: number) => H * (1 - (p - lo) / range);

  const ey = toY(entry);
  const xy = exit !== null ? toY(exit) : null;
  const sy = sl !== null ? toY(sl) : null;
  const ty = tp !== null ? toY(tp) : null;

  const exitColor =
    outcome === "win" ? "var(--color-positive)" :
    outcome === "loss" ? "var(--color-negative)" :
    outcome === "be" ? "var(--color-warning)" : "var(--color-muted)";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ display: "block", maxHeight: "240px" }}
      aria-hidden="true"
    >
      {/* Risk zone: entry ↔ SL */}
      {sy !== null && (
        <rect
          x={lx}
          y={Math.min(ey, sy)}
          width={dw}
          height={Math.abs(ey - sy)}
          fill="color-mix(in srgb, var(--color-negative) 10%, transparent)"
        />
      )}

      {/* Reward zone: entry ↔ TP */}
      {ty !== null && (
        <rect
          x={lx}
          y={Math.min(ey, ty)}
          width={dw}
          height={Math.abs(ey - ty)}
          fill="color-mix(in srgb, var(--color-positive) 10%, transparent)"
        />
      )}

      {/* SL dashed line */}
      {sy !== null && sl !== null && (
        <>
          <line
            x1={lx} y1={sy} x2={rx} y2={sy}
            stroke="var(--color-negative)" strokeWidth="1.5" strokeDasharray="5 4"
          />
          <text x={lx - 6} y={sy + 4} textAnchor="end"
            fill="var(--color-negative)" fontSize="10" fontFamily="monospace">
            {formatPrice(sl)}
          </text>
          <text x={rx + 6} y={sy + 4} textAnchor="start"
            fill="var(--color-negative)" fontSize="10" fontWeight="bold">
            {t.slLabel}
          </text>
        </>
      )}

      {/* TP dashed line */}
      {ty !== null && tp !== null && (
        <>
          <line
            x1={lx} y1={ty} x2={rx} y2={ty}
            stroke="var(--color-positive)" strokeWidth="1.5" strokeDasharray="5 4"
          />
          <text x={lx - 6} y={ty + 4} textAnchor="end"
            fill="var(--color-positive)" fontSize="10" fontFamily="monospace">
            {formatPrice(tp)}
          </text>
          <text x={rx + 6} y={ty + 4} textAnchor="start"
            fill="var(--color-positive)" fontSize="10" fontWeight="bold">
            {t.tpLabel}
          </text>
        </>
      )}

      {/* Entry solid line + left dot */}
      <line x1={lx} y1={ey} x2={rx} y2={ey}
        stroke="var(--color-muted)" strokeWidth="2" />
      <circle cx={lx + dw * 0.12} cy={ey} r="5" fill="var(--color-muted)" />
      <text x={lx - 6} y={ey + 4} textAnchor="end"
        fill="var(--color-muted)" fontSize="10" fontFamily="monospace">
        {formatPrice(entry)}
      </text>
      <text x={rx + 6} y={ey + 4} textAnchor="start"
        fill="var(--color-muted)" fontSize="10" fontWeight="bold">
        {t.entryLabel}
      </text>

      {/* Exit solid line + right dot + dashed connector */}
      {xy !== null && exit !== null && (
        <>
          <line
            x1={lx + dw * 0.12} y1={ey}
            x2={lx + dw * 0.88} y2={xy}
            stroke={exitColor} strokeWidth="1.5"
            strokeDasharray="4 3" opacity="0.45"
          />
          <line x1={lx} y1={xy} x2={rx} y2={xy}
            stroke={exitColor} strokeWidth="2" />
          <circle cx={lx + dw * 0.88} cy={xy} r="5" fill={exitColor} />
          <text x={lx - 6} y={xy + 4} textAnchor="end"
            fill={exitColor} fontSize="10" fontFamily="monospace">
            {formatPrice(exit)}
          </text>
          <text x={rx + 6} y={xy + 4} textAnchor="start"
            fill={exitColor} fontSize="10" fontWeight="bold">
            {t.exitLabel}
          </text>
        </>
      )}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TradeReplayPage({
  params,
}: {
  params: Promise<{ accountId: string; tradeId: string }>;
}) {
  const { accountId, tradeId } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.accountMember.findFirst({
    where: { userId: session.user.id, tradingAccountId: accountId },
    include: {
      user: { select: { appLanguage: true } },
      tradingAccount: { select: { currency: true } },
    },
  });
  if (!membership) redirect("/accounts");

  const trade = await prisma.trade.findFirst({
    where: { id: Number(tradeId), tradingAccountId: accountId },
    include: { strategyRef: { select: { name: true, color: true } } },
  });
  if (!trade) redirect(`/accounts/${accountId}/diary`);

  const language = normalizeAppLanguage(membership.user.appLanguage);
  const t = pageLabels[language];
  const currency = membership.tradingAccount.currency ?? "USD";

  // ── Derived values ──────────────────────────────────────────────────────

  const isLong = trade.direction?.toLowerCase() === "long";
  const directionLabel = isLong ? t.long : t.short;
  // Cold family, not green/red - direction isn't a P&L outcome, and the
  // outcome badge right next to it already owns that semantic space.
  const directionClass = isLong
    ? "border-accent-bright/30 bg-accent-bright/10 text-accent-bright"
    : "border-accent/30 bg-accent/10 text-accent";

  const outcomeLabel =
    trade.outcome === "win" ? t.win :
    trade.outcome === "loss" ? t.loss :
    trade.outcome === "be" ? t.be : null;

  const outcomeClass =
    trade.outcome === "win"
      ? "border-green-500/30 bg-accent/10 text-green-300"
      : trade.outcome === "loss"
        ? "border-red-500/30 bg-red-500/10 text-red-300"
        : trade.outcome === "be"
          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
          : "border-white/10 bg-white/5 text-muted";

  const pnlColor =
    (trade.resultUsd ?? 0) > 0 ? "text-green-400" :
    (trade.resultUsd ?? 0) < 0 ? "text-red-400" : "text-muted";

  const duration = calcDuration(trade.openDate, trade.closeDate, t);

  const actualRR = computeActualRR(
    trade.openingPrice,
    trade.closingPrice,
    trade.stopLoss,
    trade.outcome,
  );

  // ── Price level grid ────────────────────────────────────────────────────

  const entry = trade.openingPrice;

  const exitColor =
    trade.outcome === "win" ? "var(--color-positive)" :
    trade.outcome === "loss" ? "var(--color-negative)" :
    trade.outcome === "be" ? "var(--color-warning)" : "var(--color-muted)";

  const priceLevels = [
    {
      label: t.entryLabel,
      price: trade.openingPrice,
      color: "var(--color-muted)",
      pct: null as string | null,
    },
    {
      label: t.exitLabel,
      price: trade.closingPrice,
      color: exitColor,
      pct:
        trade.closingPrice !== null && entry !== null
          ? pctFromEntry(trade.closingPrice, entry)
          : null,
    },
    {
      label: t.slLabel,
      price: trade.stopLoss,
      color: "var(--color-negative)",
      pct:
        trade.stopLoss !== null && entry !== null
          ? pctFromEntry(trade.stopLoss, entry)
          : null,
    },
    {
      label: t.tpLabel,
      price: trade.takeProfit,
      color: "var(--color-positive)",
      pct:
        trade.takeProfit !== null && entry !== null
          ? pctFromEntry(trade.takeProfit, entry)
          : null,
    },
  ];

  // ── Hero metrics (secondary strip) ──────────────────────────────────────

  const heroMetrics = [
    {
      label: t.resultUsd,
      value:
        trade.resultUsd !== null
          ? formatCurrencyByLanguage(trade.resultUsd, currency, language)
          : t.noData,
      tone: pnlColor,
    },
    {
      label: t.resultPct,
      value:
        trade.resultPercent !== null
          ? `${trade.resultPercent >= 0 ? "+" : ""}${trade.resultPercent.toFixed(2)}%`
          : t.noData,
      tone: pnlColor,
    },
    {
      label: t.plannedRR,
      value:
        trade.riskReward !== null
          ? `1 : ${trade.riskReward.toFixed(2)}`
          : t.noData,
      tone: "text-white",
    },
    {
      label: t.actualRR,
      value:
        actualRR !== null
          ? actualRR === 0
            ? "0"
            : `${actualRR < 0 ? "−" : ""}1 : ${Math.abs(actualRR).toFixed(2)}`
          : t.noData,
      tone:
        actualRR === null
          ? "text-muted-faint"
          : actualRR > 0
            ? "text-green-400"
            : actualRR < 0
              ? "text-red-400"
              : "text-yellow-400",
    },
  ];

  // ── Costs & equity (Act 03) ─────────────────────────────────────────────

  const costMetrics = [
    {
      label: t.commission,
      value:
        trade.commission !== null
          ? formatCurrencyByLanguage(trade.commission, currency, language)
          : t.noData,
    },
    {
      label: t.swap,
      value:
        trade.swap !== null
          ? formatCurrencyByLanguage(trade.swap, currency, language)
          : t.noData,
    },
    {
      label: t.fees,
      value:
        trade.fees !== null
          ? formatCurrencyByLanguage(trade.fees, currency, language)
          : t.noData,
    },
    {
      label: t.equityAfter,
      value:
        trade.equity !== null
          ? formatCurrencyByLanguage(trade.equity, currency, language)
          : t.noData,
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/accounts/${accountId}/diary`}
          className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-2.5 text-sm text-muted transition-colors duration-base hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft size={14} />
          {t.backToDiary}
        </Link>
        <Link
          href={`/accounts/${accountId}/diary/${tradeId}/edit`}
          className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-2.5 text-sm text-muted transition-colors duration-base hover:bg-white/[0.05] hover:text-white"
        >
          <Pencil size={14} />
          {t.editTrade}
        </Link>
      </div>

      {/* Hero: the one dominant truth — what happened, and what it was worth */}
      <div className="reveal-rise" style={{ animationDelay: "0ms" }}>
        <Card variant="hero" className="p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <SignatureEdge orientation="vertical" className="h-4" />
            <p className="text-sm text-muted">{t.badge}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-hero text-white">{trade.symbol}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black tracking-widest ${directionClass}`}
                >
                  {directionLabel}
                </span>
                {outcomeLabel && (
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black tracking-widest ${outcomeClass}`}
                  >
                    {outcomeLabel}
                  </span>
                )}
                {trade.strategyRef && (
                  <span
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold"
                    style={{ color: trade.strategyRef.color ?? "#9fb4dd" }}
                  >
                    {trade.strategyRef.name}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {trade.resultUsd !== null ? (
                <p className={`text-4xl font-black tabular-nums sm:text-5xl ${pnlColor}`}>
                  {formatCurrencyByLanguage(trade.resultUsd, currency, language)}
                </p>
              ) : (
                <p className="text-4xl font-black text-muted-faint">{t.noData}</p>
              )}
              <p className="mt-1 text-sm text-muted-faint">
                {formatDate(trade.openDate)}
                {trade.closeDate && (
                  <> &rarr; {formatDate(trade.closeDate)}</>
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary: compact result strip, once, right under the hero */}
      <div
        className="reveal-rise grid grid-cols-2 gap-4 sm:grid-cols-4"
        style={{ animationDelay: "60ms" }}
      >
        {heroMetrics.map((m) => (
          <Card key={m.label} interactive className="p-5">
            <p className="text-sm text-muted">{m.label}</p>
            <h3 className={`mt-2 text-2xl font-bold ${m.tone}`}>{m.value}</h3>
          </Card>
        ))}
      </div>

      {/* Act 01 — The Plan: what was intended before the trade happened */}
      <Card className="reveal-rise p-6 sm:p-10" style={{ animationDelay: "100ms" }}>
        <ActHeader number="01" title={t.actSetupTitle} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <SubCaption>{t.strategyLabel}</SubCaption>
            {trade.strategyRef ? (
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: trade.strategyRef.color ?? "#9fb4dd" }}
                />
                <span className="text-lg font-black text-white">{trade.strategyRef.name}</span>
              </div>
            ) : trade.strategy ? (
              <p className="text-lg font-black text-white">{trade.strategy}</p>
            ) : (
              <p className="text-sm text-muted-faint">{t.noData}</p>
            )}
          </div>

          <div>
            <SubCaption>{t.setupQualityLabel}</SubCaption>
            {trade.setupQuality !== null ? (
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-5 rounded-full ${i < trade.setupQuality! ? "bg-accent" : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-black text-white">
                  {trade.setupQuality}
                  <span className="ml-0.5 text-sm text-muted-faint">/10</span>
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-faint">{t.noData}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-6">
          <SubCaption>{t.reasonLabel}</SubCaption>
          {trade.reason ? (
            <p className="text-sm leading-relaxed text-gray-300">{trade.reason}</p>
          ) : (
            <p className="text-sm text-muted-faint">{t.noData}</p>
          )}
        </div>
      </Card>

      {/* Act 02 — The Trade: the price action and the state of mind behind it */}
      <Card className="reveal-rise p-6 sm:p-10" style={{ animationDelay: "140ms" }}>
        <ActHeader number="02" title={t.actTradeTitle} />

        <SubCaption>{t.anatomyTitle}</SubCaption>
        <Card variant="inner" className="p-4 sm:p-6">
          <PriceAnatomySVG
            entry={trade.openingPrice}
            exit={trade.closingPrice}
            sl={trade.stopLoss}
            tp={trade.takeProfit}
            outcome={trade.outcome}
            t={t}
          />
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {priceLevels.map(({ label, price, color, pct }) => (
            <Card key={label} variant="inner" className="p-4">
              <p
                className="text-[10px] font-black uppercase tracking-[0.15em]"
                style={{ color }}
              >
                {label}
              </p>
              <p className="mt-1.5 text-base font-black tabular-nums text-white">
                {price !== null ? formatPrice(price) : t.noData}
              </p>
              {pct !== null && (
                <p className="mt-0.5 text-xs" style={{ color, opacity: 0.75 }}>
                  {pct}
                </p>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <SubCaption>{t.timelineTitle}</SubCaption>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card variant="inner" className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-faint">
                {t.openDate}
              </p>
              <p className="mt-2 text-base font-black text-white">
                {formatDate(trade.openDate)}
              </p>
              <p className="mt-0.5 font-mono text-sm text-muted-faint">
                {trade.openTime || formatTimeHM(trade.openDate)}
              </p>
            </Card>

            <Card variant="inner" className="p-5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-accent-bright">
                {t.duration}
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {duration}
              </p>
              {trade.session && (
                <p className="mt-1 text-xs text-muted-faint">
                  {capitalizeSession(trade.session)}
                </p>
              )}
            </Card>

            <Card variant="inner" className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-faint">
                {t.closeDate}
              </p>
              {trade.closeDate ? (
                <>
                  <p className="mt-2 text-base font-black text-white">
                    {formatDate(trade.closeDate)}
                  </p>
                  <p className="mt-0.5 font-mono text-sm text-muted-faint">
                    {formatTimeHM(trade.closeDate)}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-faint">{t.openTrade}</p>
              )}
            </Card>
          </div>
        </div>

        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <SubCaption>{t.executionTitle}</SubCaption>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card variant="inner" className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-faint">
                {t.executionRatingLabel}
              </p>
              {trade.executionRating !== null ? (
                <>
                  <p className="mt-3 text-3xl font-black text-white">
                    {trade.executionRating}
                    <span className="text-sm text-muted-faint">/10</span>
                  </p>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${i < trade.executionRating! ? "bg-accent" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-faint">{t.noData}</p>
              )}
            </Card>

            <Card variant="inner" className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-faint">
                {t.confidenceLabel}
              </p>
              {trade.confidence !== null ? (
                <>
                  <p className="mt-3 text-3xl font-black text-white">
                    {trade.confidence}
                    <span className="text-sm text-muted-faint">/10</span>
                  </p>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${i < trade.confidence! ? "bg-accent-bright" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-faint">{t.noData}</p>
              )}
            </Card>

            <Card variant="inner" className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-faint">
                {t.emotionalStateLabel}
              </p>
              {trade.emotionalState ? (
                <div className="mt-3">
                  <span className={`inline-block rounded-full border px-3 py-1.5 text-sm font-bold ${EMOTION_PILL_CLASS}`}>
                    {emotionLabel(trade.emotionalState, t)}
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-faint">{t.noData}</p>
              )}
            </Card>
          </div>
        </div>
      </Card>

      {/* Act 03 — The Outcome: the bill, and what to carry forward */}
      <Card className="reveal-rise p-6 sm:p-10" style={{ animationDelay: "180ms" }}>
        <ActHeader number="03" title={t.actOutcomeTitle} />

        <SubCaption>{t.costsLabel}</SubCaption>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {costMetrics.map(({ label, value }) => (
            <Card key={label} variant="inner" className="p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-faint">
                {label}
              </p>
              <p className="mt-2 text-lg font-black text-white">{value}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 space-y-4 border-t border-white/[0.06] pt-8">
          <SubCaption>{t.reviewTitle}</SubCaption>

          <div className="rounded-inner border border-red-500/15 bg-red-500/[0.04] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400">
              {t.mistakesLabel}
            </p>
            {trade.mistakes ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{trade.mistakes}</p>
            ) : (
              <p className="mt-2 text-sm text-muted-faint">{t.noData}</p>
            )}
          </div>

          <div className="rounded-inner border border-accent/15 bg-accent/[0.04] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-accent">
              {t.lessonsLabel}
            </p>
            {trade.lessonsLearned ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{trade.lessonsLearned}</p>
            ) : (
              <p className="mt-2 text-sm text-muted-faint">{t.noData}</p>
            )}
          </div>

          <Card variant="inner" className="p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-faint">
              {t.notesLabel}
            </p>
            {trade.notes ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{trade.notes}</p>
            ) : (
              <p className="mt-2 text-sm text-muted-faint">{t.noData}</p>
            )}
          </Card>
        </div>
      </Card>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between pb-4">
        <Link
          href={`/accounts/${accountId}/diary`}
          className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-2.5 text-sm text-muted transition-colors duration-base hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft size={14} />
          {t.backToDiary}
        </Link>
        <Link
          href={`/accounts/${accountId}/diary/${tradeId}/edit`}
          className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-2.5 text-sm text-muted transition-colors duration-base hover:bg-white/[0.05] hover:text-white"
        >
          <Pencil size={14} />
          {t.editTrade}
        </Link>
      </div>

    </div>
  );
}
