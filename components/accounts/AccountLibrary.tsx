"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import Card from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";
import AccountActionsMenu from "@/components/accounts/AccountActionsMenu";

const VIEW_KEY = "voltis-account-library-view";
type LibraryView = "focus" | "gallery" | "grid";
type QuickFilter = "ALL" | "LIVE" | "DEMO" | "PROP" | "SHARED";
type AccountTypeFilter = "ANY" | "LIVE" | "DEMO" | "PROP" | "CHALLENGE" | "FUNDED" | "SHARED";
type CollaborationFilter = "ANY" | "MEMBERS_2" | "MEMBERS_3" | "MEMBERS_4";
type AccessFilter = "ANY" | "MANAGER" | "MEMBER" | "VIEWER";
type ActivityFilter = "ANY" | "WITH_TRADES" | "NO_TRADES";

export type AccountLibraryItem = {
  id: string;
  name: string;
  type: string;
  status: string;
  membershipRole: string;
  membersCount: number;
  formattedMembersCount: string;
  hasMultipleMembers: boolean;
  isSharedType: boolean;
  initialBalance: number;
  formattedInitialBalance: string;
  pnl: number;
  formattedPnl: string;
  pnlValue: number;
  tradeCount: number;
  formattedTradeCount: string;
  winRate: string | null;
  winRateValue: number | null;
  currency: string;
  brokerProvider: string | null;
  updatedAt: string;
  canViewMembers: boolean;
  canManageIntegrations: boolean;
  canOpenManage: boolean;
  canArchiveAccount: boolean;
  canDeleteAccount: boolean;
};

type Labels = {
  initialBalance: string;
  trades: string;
  winRate: string;
  notMeasured: string;
  member: string;
  members: string;
  pnl: string;
  openAccount: string;
  archived: string;
};

function AccountCover({ account, active }: { account: AccountLibraryItem; active: boolean }) {
  const seed = [...account.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const shift = 18 + (seed % 36);
  const isTechnical = account.type === "PROP" || account.type === "CHALLENGE" || account.type === "FUNDED";

  return (
    <div
      aria-hidden="true"
      className={`relative h-full overflow-hidden ${account.status === "ARCHIVED" ? "grayscale opacity-60" : ""}`}
      style={{
        background: `radial-gradient(circle at ${shift}% 38%, rgba(91,224,255,.16), transparent 28%), linear-gradient(145deg, #081322, #03070e 68%, #0b2030)`,
      }}
    >
      <svg viewBox="0 0 600 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`cover-${account.id}`} x1="0" x2="1">
            <stop stopColor="#235d94" stopOpacity="0" />
            <stop offset=".48" stopColor="#6be9ff" stopOpacity=".72" />
            <stop offset="1" stopColor="#235d94" stopOpacity="0" />
          </linearGradient>
        </defs>
        {isTechnical ? (
          <>
            <path d={`M${80 + (seed % 45)} 190 L225 42 L330 154 L500 25`} fill="none" stroke={`url(#cover-${account.id})`} strokeWidth="2" />
            <path d="M52 52 H548 M52 110 H548 M52 168 H548 M150 20 V200 M300 20 V200 M450 20 V200" stroke="#70e7ff" strokeOpacity=".07" strokeWidth="1" />
          </>
        ) : account.isSharedType ? (
          <>
            <path d={`M-20 54 C155 ${30 + (seed % 30)} 235 104 302 112 C385 122 448 62 620 54`} fill="none" stroke={`url(#cover-${account.id})`} strokeWidth="2" />
            <path d={`M-20 176 C140 ${196 - (seed % 30)} 230 124 302 112 C390 98 464 168 620 176`} fill="none" stroke={`url(#cover-${account.id})`} strokeWidth="1.5" />
          </>
        ) : (
          <>
            <path d={`M${shift * 3} 230 C${shift * 3 - 38} 154 ${shift * 3 + 65} 92 ${shift * 3 + 20} -10`} fill="none" stroke={`url(#cover-${account.id})`} strokeWidth="3" />
            <path d={`M${shift * 3 + 18} 230 C${shift * 3 - 10} 142 ${shift * 3 + 92} 80 ${shift * 3 + 50} -10`} fill="none" stroke="#58dff7" strokeOpacity=".16" />
          </>
        )}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: active
            ? "linear-gradient(180deg, transparent 32%, rgba(2,6,12,.16) 52%, rgba(2,6,12,.95) 100%)"
            : "linear-gradient(180deg, transparent 36%, rgba(2,6,12,.1) 56%, rgba(2,6,12,.88) 100%)",
        }}
      />
    </div>
  );
}

function getPnlTone(value: number) {
  if (value > 0) return "text-accent";
  if (value < 0) return "text-red-400";
  return "text-muted";
}

function getWinRateTone(value: number | null) {
  if (value === null) return "text-muted";
  return value >= 50 ? "text-accent" : "text-red-400";
}

function getMemberCountLabel(account: AccountLibraryItem, labels: Labels) {
  return `${account.formattedMembersCount} ${account.membersCount === 1 ? labels.member : labels.members}`;
}

function getMembersHeading(labels: Labels) {
  return `${labels.members.charAt(0).toUpperCase()}${labels.members.slice(1)}`;
}

type PnlPercentageBadgeData = {
  label: string;
  tone: "positive" | "negative" | "neutral";
  accessibleLabel: string;
};

export function getPnlPercentageBadgeData({ pnl, initialBalance, tradesCount }: { pnl: number; initialBalance: number; tradesCount: number }): PnlPercentageBadgeData {
  if (!Number.isFinite(pnl) || !Number.isFinite(initialBalance) || initialBalance <= 0) {
    return { label: "--", tone: "neutral", accessibleLabel: "PnL percentage unavailable" };
  }

  const percentage = (pnl / initialBalance) * 100;
  if (tradesCount === 0 || pnl === 0 || percentage === 0) {
    return { label: "0.00%", tone: "neutral", accessibleLabel: "PnL percentage: 0.00 percent" };
  }
  if (percentage > 0) {
    return { label: `+${percentage.toFixed(2)}%`, tone: "positive", accessibleLabel: `PnL percentage: positive ${percentage.toFixed(2)} percent` };
  }
  return { label: `${percentage.toFixed(2)}%`, tone: "negative", accessibleLabel: `PnL percentage: negative ${Math.abs(percentage).toFixed(2)} percent` };
}

export function sortAccountLibraryItems<T extends Pick<AccountLibraryItem, "id" | "name">>(accounts: T[]) {
  return [...accounts].sort((left, right) => {
    const nameOrder = left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
    return nameOrder !== 0 ? nameOrder : left.id.localeCompare(right.id);
  });
}

export function getAccountLibraryPnlAggregate(
  accounts: Array<Pick<AccountLibraryItem, "currency" | "pnl">>,
) {
  if (accounts.length === 0) {
    return { kind: "empty" as const, pnl: 0, currency: null };
  }

  const currencies = new Set(accounts.map((account) => account.currency));
  if (currencies.size !== 1) {
    return { kind: "mixed" as const, pnl: null, currency: null };
  }

  return {
    kind: "single" as const,
    pnl: accounts.reduce((sum, account) => sum + account.pnl, 0),
    currency: accounts[0].currency,
  };
}

function PnlPercentageBadge({ data }: { data: PnlPercentageBadgeData }) {
  const toneClass = data.tone === "positive"
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
    : data.tone === "negative"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
      : "border-slate-500/10 bg-slate-500/5 text-slate-500";
  return <span aria-label={data.accessibleLabel} className={`inline-flex h-7 min-w-[76px] shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold tabular-nums ${toneClass}`}>{data.label}</span>;
}

function GridAccountCard({ account, labels }: { account: AccountLibraryItem; labels: Labels }) {
  const pnlPercentageBadge = getPnlPercentageBadgeData({ pnl: account.pnlValue, initialBalance: account.initialBalance, tradesCount: account.tradeCount });

  return (
    <article className="group relative rounded-2xl border border-white/[0.03] bg-[#070d19]/90 p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,.55)] transition-[transform,border-color,background-color,box-shadow] duration-[240ms] ease-out hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-[#09111f]/95 hover:shadow-[0_12px_30px_-10px_rgba(0,242,254,.12)] focus-within:border-cyan-400/35 focus-within:bg-[#09111f]/95 motion-reduce:hover:translate-y-0 motion-reduce:transition-colors">
      <Link href={`/accounts/${account.id}/dashboard`} aria-label={`Open ${account.name} workspace`} className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/70"><span className="sr-only">Open {account.name} workspace</span></Link>
      <div className="pointer-events-none relative z-20">
        <div className="flex items-start gap-3 pr-12">
          <IconTile interactive={false}><Wallet size={20} /></IconTile>
          <div className="min-w-0 flex-1">
            <p className="text-micro uppercase tracking-label text-muted"><span className="text-accent-bright">{account.type}</span><span className="text-muted-faint"> · </span>{account.status}<span className="text-muted-faint"> · </span>{account.membershipRole}</p>
            <h3 aria-label={account.name} title={account.name} className="mt-1.5 line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-7 text-white">{account.name}</h3>
          </div>
        </div>
        <div className="mt-4 flex min-w-0 items-end justify-between gap-4">
          <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{labels.pnl}</p><p className={`mt-0.5 truncate text-xl font-bold tabular-nums ${getPnlTone(account.pnlValue)}`}>{account.formattedPnl}</p></div>
          <PnlPercentageBadge data={pnlPercentageBadge} />
        </div>
        <div className="my-4 border-t border-slate-900/80" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><TrendingUp size={12} aria-hidden="true" />{labels.initialBalance}</p><p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-300">{account.formattedInitialBalance}</p></div>
          <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><Activity size={12} aria-hidden="true" />{labels.trades}</p><p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-300">{account.formattedTradeCount}</p></div>
          <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><Shield size={12} aria-hidden="true" />{labels.winRate}</p><p className={`mt-0.5 text-sm font-semibold ${getWinRateTone(account.winRateValue)}`}>{account.winRate ?? labels.notMeasured}</p></div>
          <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><Users size={12} aria-hidden="true" />{getMembersHeading(labels)}</p><p className="mt-0.5 text-sm font-semibold text-slate-300">{getMemberCountLabel(account, labels)}</p></div>
        </div>
      </div>
      <ArrowRight size={16} aria-hidden="true" className="pointer-events-none absolute right-[4.5rem] top-8 z-20 -translate-x-1 text-cyan-300/70 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 motion-reduce:transform-none" />
      <div className="pointer-events-auto absolute right-5 top-5 z-30"><AccountActionsMenu accountId={account.id} accountName={account.name} accountStatus={account.status} canOpenManage={account.canOpenManage} canViewMembers={account.canViewMembers} canManageIntegrations={account.canManageIntegrations} canArchiveAccount={account.canArchiveAccount} canDeleteAccount={account.canDeleteAccount} placement="grid" /></div>
    </article>
  );
}

export function FocusCoverCard({ account, labels, active }: { account: AccountLibraryItem; labels: Labels; active: boolean }) {
  const pnlPercentageBadge = getPnlPercentageBadgeData({ pnl: account.pnlValue, initialBalance: account.initialBalance, tradesCount: account.tradeCount });

  return (
    <article data-active={active} className={`relative w-full overflow-hidden rounded-card border border-white/[0.05] bg-[#070d19]/80 p-5 backdrop-blur-xl sm:p-6 ${active ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,.9)]" : "shadow-[0_20px_52px_-18px_rgba(0,0,0,.6)]"}`}>
      <div className="absolute right-0 top-0 h-[58%] w-[62%] opacity-25">
        <AccountCover account={account} active={active} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,13,25,.98)_0%,rgba(7,13,25,.9)_54%,rgba(7,13,25,.58)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.025)]" />
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <IconTile interactive={false}><Wallet size={20} /></IconTile>
          <div className="min-w-0 flex-1">
            <p className="text-micro uppercase tracking-label text-muted"><span className="text-accent-bright">{account.type}</span><span className="text-muted-faint"> · </span>{account.status}<span className="text-muted-faint"> · </span>{account.membershipRole}</p>
            <h3 aria-label={account.name} title={account.name} className="mt-1.5 line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-7 text-white">{account.name}</h3>
          </div>
          {active && <AccountActionsMenu accountId={account.id} accountName={account.name} accountStatus={account.status} canOpenManage={account.canOpenManage} canViewMembers={account.canViewMembers} canManageIntegrations={account.canManageIntegrations} canArchiveAccount={account.canArchiveAccount} canDeleteAccount={account.canDeleteAccount} placement="focus" />}
        </div>
        <div className={`mt-4 rounded-xl border border-slate-800/40 bg-slate-950/40 p-4 ${active ? "" : "max-w-[82%]"}`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{labels.pnl}</p>
          <div className="mt-1 flex items-end justify-between gap-3"><p className={`text-3xl font-black leading-tight ${getPnlTone(account.pnlValue)}`}>{account.formattedPnl}</p>{active && <PnlPercentageBadge data={pnlPercentageBadge} />}</div>
        </div>
        {active && <>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">
            <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><TrendingUp size={12} aria-hidden="true" />{labels.initialBalance}</p><p className="mt-0.5 text-sm font-semibold text-slate-200">{account.formattedInitialBalance}</p></div>
            <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><Activity size={12} aria-hidden="true" />{labels.trades}</p><p className="mt-0.5 text-sm font-semibold text-slate-200">{account.formattedTradeCount}</p></div>
            <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><Shield size={12} aria-hidden="true" />{labels.winRate}</p><p className={`mt-0.5 text-sm font-semibold ${getWinRateTone(account.winRateValue)}`}>{account.winRate ?? labels.notMeasured}</p></div>
            <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"><Users size={12} aria-hidden="true" />{getMembersHeading(labels)}</p><p className="mt-0.5 text-sm font-semibold text-slate-200">{getMemberCountLabel(account, labels)}</p></div>
          </div>
          <Link href={`/accounts/${account.id}/dashboard`} className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 outline-none transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-900 hover:shadow-[0_0_20px_rgba(34,211,238,.12)] focus-visible:ring-2 focus-visible:ring-accent-bright/70">Open Workspace<ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" /></Link>
        </>}
      </div>
    </article>
  );
}

type StepperOption<T extends string> = { value: T; label: string };

function FilterStepper<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<StepperOption<T>>; onChange: (value: T) => void }) {
  const index = options.findIndex((option) => option.value === value);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [outgoingLabel, setOutgoingLabel] = useState<string | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = (nextIndex: number, nextDirection: -1 | 1) => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setOutgoingLabel(options[index].label);
    setDirection(nextDirection);
    onChange(options[nextIndex].value);
    transitionTimer.current = setTimeout(() => setOutgoingLabel(null), 210);
  };

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  return (
    <div className="flex min-h-9 items-center justify-between gap-3 border-b border-flash/[0.06] py-1.5 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <div className={`flex h-8 w-36 shrink-0 items-center rounded-inner border-[0.5px] bg-surface-2/80 ${value === "ANY" ? "border-flash/[0.1]" : "border-accent-bright/25"}`}>
        <button type="button" disabled={index === 0} aria-label={`Previous ${label} option`} onClick={() => step(index - 1, -1)} className="flex size-8 shrink-0 items-center justify-center rounded-l-inner text-muted outline-none hover:text-flash focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-25"><ChevronLeft size={14} aria-hidden="true" /></button>
        <span aria-live="polite" className="relative min-w-0 flex-1 self-stretch overflow-hidden text-center text-[11px] font-medium">
          {outgoingLabel && <span className="absolute inset-0 flex items-center justify-center truncate text-muted animate-[filter-step-out_200ms_cubic-bezier(.2,.72,.22,1)_forwards] motion-reduce:hidden" style={{ "--filter-direction": direction } as React.CSSProperties}>{outgoingLabel}</span>}
          <span key={value} className={`absolute inset-0 flex items-center justify-center truncate ${value === "ANY" ? "text-muted" : "text-accent-bright"} animate-[filter-step-in_200ms_cubic-bezier(.2,.72,.22,1)] motion-reduce:animate-none`} style={{ "--filter-direction": direction } as React.CSSProperties}>{options[index].label}</span>
        </span>
        <button type="button" disabled={index === options.length - 1} aria-label={`Next ${label} option`} onClick={() => step(index + 1, 1)} className="flex size-8 shrink-0 items-center justify-center rounded-r-inner text-muted outline-none hover:text-flash focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-25"><ChevronRight size={14} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

export function isEditableFocusTarget(target: EventTarget | null) {
  const candidate = target as (EventTarget & { closest?: (selector: string) => unknown }) | null;
  return typeof candidate?.closest === "function"
    && Boolean(candidate.closest("input, textarea, select, [contenteditable='true'], [role='textbox']"));
}

export function getFocusSelectionIndex(index: number, delta: number, accountCount: number) {
  return Math.max(0, Math.min(accountCount - 1, index + delta));
}

export function getFocusCardTransition(reducedMotion: boolean) {
  return reducedMotion
    ? "none"
    : "transform var(--duration-base) ease-out, opacity var(--duration-base) ease-out, filter var(--duration-base) ease-out";
}

export function FocusNavigationControls({ index, accountCount, onMove }: { index: number; accountCount: number; onMove: (delta: -1 | 1) => void }) {
  return (
    <div className="relative z-30 mt-4 flex items-center justify-center gap-3">
      <button type="button" aria-label="Previous account" disabled={index === 0} onClick={() => onMove(-1)} className="flex size-11 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 text-muted outline-none transition-colors duration-fast hover:border-accent-bright/25 hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transition-none"><ChevronLeft size={18} aria-hidden="true" /></button>
      <p aria-hidden="true" className="min-w-16 text-center text-xs tracking-[0.08em]"><span className="font-medium tabular-nums text-flash/80">{index + 1}</span><span className="text-muted-faint"> of {accountCount}</span></p>
      <button type="button" aria-label="Next account" disabled={index === accountCount - 1} onClick={() => onMove(1)} className="flex size-11 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 text-muted outline-none transition-colors duration-fast hover:border-accent-bright/25 hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transition-none"><ChevronRight size={18} aria-hidden="true" /></button>
    </div>
  );
}

export default function AccountLibrary({ accounts, labels }: { accounts: AccountLibraryItem[]; labels: Labels }) {
  const [view, setView] = useState<LibraryView>("grid");
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("ALL");
  const [accountType, setAccountType] = useState<AccountTypeFilter>("ANY");
  const [collaboration, setCollaboration] = useState<CollaborationFilter>("ANY");
  const [access, setAccess] = useState<AccessFilter>("ANY");
  const [activity, setActivity] = useState<ActivityFilter>("ANY");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const quickOptions: Array<StepperOption<QuickFilter>> = [{ value: "ALL", label: "Accounts" }, { value: "LIVE", label: "Live" }, { value: "DEMO", label: "Demo" }, { value: "PROP", label: "Prop" }, { value: "SHARED", label: "Shared" }];
  const quickRefs = useRef<Partial<Record<QuickFilter, HTMLButtonElement | null>>>({});
  const [quickIndicator, setQuickIndicator] = useState({ left: 0, width: 0 });
  const filtersRootRef = useRef<HTMLDivElement>(null);
  const filtersTriggerRef = useRef<HTMLButtonElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef({ pointerId: -1, startX: 0, startY: 0, axis: "pending" as "pending" | "horizontal" | "vertical" });
  const showAccountType = quickFilter === "ALL";
  const showCollaboration = true;
  const activeFiltersCount = (showAccountType && accountType !== "ANY" ? 1 : 0) + (showCollaboration && collaboration !== "ANY" ? 1 : 0) + (access !== "ANY" ? 1 : 0) + (activity !== "ANY" ? 1 : 0);

  useEffect(() => {
    const active = quickRefs.current[quickFilter];
    if (active) setQuickIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, [quickFilter]);

  useEffect(() => {
    if (!isFiltersOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!filtersRootRef.current?.contains(event.target as Node)) setIsFiltersOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFiltersOpen(false);
        filtersTriggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isFiltersOpen]);

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "showcase" || saved === "focus" || saved === "grid") {
      queueMicrotask(() => setView(saved === "showcase" ? "focus" : saved));
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  const chooseView = (next: Exclude<LibraryView, "gallery">) => {
    setView(next);
    window.localStorage.setItem(VIEW_KEY, next);
  };

  const clearAdvancedFilters = () => {
    setAccountType("ANY");
    setCollaboration("ANY");
    setAccess("ANY");
    setActivity("ANY");
    setSelectedIndex(0);
  };

  const chooseQuickFilter = (next: QuickFilter) => {
    if (next !== "ALL") setAccountType("ANY");
    setQuickFilter(next);
    setSelectedIndex(0);
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return accounts.filter((account) => {
      if (account.status !== "ACTIVE") return false;
      if (term && !account.name.toLowerCase().includes(term) && !account.type.toLowerCase().includes(term) && !account.brokerProvider?.toLowerCase().includes(term)) return false;
      if (quickFilter === "LIVE" && account.type !== "LIVE") return false;
      if (quickFilter === "DEMO" && account.type !== "DEMO") return false;
      if (quickFilter === "PROP" && !["PROP", "CHALLENGE", "FUNDED"].includes(account.type)) return false;
      if (quickFilter === "SHARED" && account.type !== "SHARED") return false;
      if (showAccountType && accountType !== "ANY" && account.type !== accountType) return false;
      if (showCollaboration && collaboration === "MEMBERS_2" && account.membersCount !== 2) return false;
      if (showCollaboration && collaboration === "MEMBERS_3" && account.membersCount !== 3) return false;
      if (showCollaboration && collaboration === "MEMBERS_4" && account.membersCount !== 4) return false;
      if (access !== "ANY" && account.membershipRole !== access) return false;
      if (activity === "WITH_TRADES" && account.tradeCount <= 0) return false;
      if (activity === "NO_TRADES" && account.tradeCount !== 0) return false;
      return true;
    });
  }, [access, accountType, accounts, activity, collaboration, quickFilter, search, showAccountType, showCollaboration]);

  const selected = filtered[selectedIndex];
  const isAtStart = selectedIndex === 0;
  const isAtEnd = selectedIndex === filtered.length - 1;
  const focusEdgeBias = filtered.length <= 1
    ? "0px"
    : filtered.length === 2
      ? selectedIndex === 0
        ? "clamp(-72px, -6vw, -32px)"
        : "clamp(32px, 6vw, 72px)"
      : selectedIndex === 0
        ? "clamp(-42px, -3vw, -18px)"
        : selectedIndex === filtered.length - 1
          ? "clamp(18px, 3vw, 42px)"
          : "0px";
  const move = useCallback((delta: number) => {
    setSelectedIndex((index) => getFocusSelectionIndex(index, delta, filtered.length));
  }, [filtered.length]);

  return (
    <section aria-labelledby="account-library-title" className="account-library reveal-rise" style={{ animationDelay: "100ms" }}>
      <div className="mb-5">
        <p className="text-micro uppercase tracking-label text-accent-bright">Account library</p>
        <h2 id="account-library-title" className="mt-2 text-section text-flash">Choose your workspace</h2>
      </div>
      <div className="mb-6 flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="min-w-0 flex-1"><label className="relative block w-full lg:max-w-sm"><span className="sr-only">Search accounts</span><Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedIndex(0); }} placeholder="Search accounts" className="w-full rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-flash outline-none placeholder:text-muted-faint focus:border-accent-bright/50 focus:ring-2 focus:ring-accent-bright/30" /></label></div>
        <div className="flex min-w-0 shrink-0 items-center gap-2 max-lg:w-full">
          <div className="min-w-0 flex-1 overflow-x-auto lg:flex-none">
            <div aria-label="Quick account filter" className="relative flex w-max shrink-0 overflow-hidden rounded-pill border-[0.5px] border-flash/[0.08] bg-surface-2/70 p-1">
              <span aria-hidden="true" className="absolute bottom-1 top-1 rounded-pill border border-accent-bright/20 bg-accent/15 transition-[left,width] duration-200 ease-[cubic-bezier(.2,.72,.22,1)] motion-reduce:transition-none" style={{ left: quickIndicator.left, width: quickIndicator.width }} />
              {quickOptions.map((option) => <button ref={(node) => { quickRefs.current[option.value] = node; }} key={option.value} type="button" aria-label={option.value === "ALL" ? "All accounts" : undefined} aria-pressed={quickFilter === option.value} onClick={() => chooseQuickFilter(option.value)} className={`relative z-10 min-h-9 rounded-pill px-2.5 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${quickFilter === option.value ? "text-accent-bright" : "text-muted hover:text-flash"}`}>{option.label}</button>)}
            </div>
          </div>
          <div ref={filtersRootRef} className="relative shrink-0">
            <button ref={filtersTriggerRef} type="button" aria-haspopup="dialog" aria-expanded={isFiltersOpen} aria-label={activeFiltersCount === 0 ? "Open advanced account filters" : `Open advanced account filters, ${activeFiltersCount} active`} onClick={() => setIsFiltersOpen((open) => !open)} className={`flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-pill border-[0.5px] px-2.5 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${activeFiltersCount > 0 ? "border-accent-bright/25 bg-accent/10 text-accent-bright" : "border-flash/[0.1] bg-surface-2 text-muted hover:text-flash"}`}>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 7h10m4 0h2M4 17h2m4 0h10M14 4v6M6 14v6" /></svg>
              {activeFiltersCount > 0 && <span className="text-[11px] font-semibold tabular-nums">{activeFiltersCount}</span>}
            </button>
            {isFiltersOpen && <div role="dialog" aria-label="More filters" className="absolute right-0 top-[calc(100%+8px)] z-[100] w-80 max-w-[calc(100vw-2rem)] rounded-inner border-[0.5px] border-flash/[0.14] bg-[#08111d]/95 p-4 shadow-[0_18px_45px_rgba(0,0,0,.55)] backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between"><h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">More filters</h3><span className="text-[10px] tabular-nums text-muted-faint">{activeFiltersCount === 0 ? "None active" : `${activeFiltersCount} active`}</span></div>
              <div>
                {showAccountType && <FilterStepper label="Account type" value={accountType} onChange={(next) => { setAccountType(next); setSelectedIndex(0); }} options={[{ value: "ANY", label: "Any" }, { value: "LIVE", label: "Live" }, { value: "DEMO", label: "Demo" }, { value: "PROP", label: "Prop" }, { value: "CHALLENGE", label: "Challenge" }, { value: "FUNDED", label: "Funded" }, { value: "SHARED", label: "Shared" }]} />}
                {showCollaboration && <FilterStepper label="Collaboration" value={collaboration} onChange={(next) => { setCollaboration(next); setSelectedIndex(0); }} options={[{ value: "ANY", label: "Any" }, { value: "MEMBERS_2", label: "2 members" }, { value: "MEMBERS_3", label: "3 members" }, { value: "MEMBERS_4", label: "4 members" }]} />}
                <FilterStepper label="Access" value={access} onChange={(next) => { setAccess(next); setSelectedIndex(0); }} options={[{ value: "ANY", label: "Any" }, { value: "MANAGER", label: "Manager" }, { value: "MEMBER", label: "Member" }, { value: "VIEWER", label: "Viewer" }]} />
                <FilterStepper label="Activity" value={activity} onChange={(next) => { setActivity(next); setSelectedIndex(0); }} options={[{ value: "ANY", label: "Any" }, { value: "WITH_TRADES", label: "With trades" }, { value: "NO_TRADES", label: "No trades" }]} />
              </div>
              {activeFiltersCount > 0 && <button type="button" onClick={clearAdvancedFilters} className="mt-2 min-h-9 text-xs font-medium text-accent-bright outline-none hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60">Clear filters</button>}
            </div>}
          </div>
          <div role="group" aria-label="Library view" className="flex shrink-0 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 p-1">
            <button type="button" aria-pressed={view === "grid"} onClick={() => chooseView("grid")} className={`flex min-h-9 items-center gap-1.5 rounded-inner px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${view === "grid" ? "bg-accent/15 text-accent-bright" : "text-muted"}`}><Grid2X2 size={14} />Grid</button>
            <button type="button" aria-pressed={view === "focus"} onClick={() => chooseView("focus")} className={`flex min-h-9 items-center gap-1.5 rounded-inner px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${view === "focus" ? "bg-accent/15 text-accent-bright" : "text-muted"}`}><Sparkles size={14} />Focus</button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card variant="inner" className="border-dashed p-8 text-center"><h3 className="text-subsection text-flash">No accounts found</h3><p className="mt-2 text-caption text-muted">Try adjusting your search or account filters.</p><button type="button" onClick={() => { setSearch(""); setQuickFilter("ALL"); clearAdvancedFilters(); }} className="mt-4 rounded-inner border-[0.5px] border-accent/30 px-4 py-2 text-sm text-accent-bright">Clear filters</button></Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((account) => <GridAccountCard key={account.id} account={account} labels={labels} />)}</div>
      ) : (
        <div
          className="outline-none"
          tabIndex={0}
          aria-label="Focus account carousel"
          onKeyDown={(event) => {
            if (isEditableFocusTarget(event.target)) return;
            if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
            if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
          }}
        >
          <p className="sr-only" aria-live="polite">{selected.name}, account {selectedIndex + 1} of {filtered.length}</p>
          <div className="relative overflow-visible pt-5">
          <div ref={carouselRef} className="relative mx-auto h-[390px] max-w-[1280px] touch-pan-y overflow-x-clip overflow-y-visible select-none"
            onPointerMove={(event) => { const touch = touchRef.current; if (touch.pointerId !== event.pointerId) return; const dx = event.clientX - touch.startX; const dy = event.clientY - touch.startY; if (touch.axis === "pending" && Math.hypot(dx, dy) > 8) touch.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? "horizontal" : "vertical"; if (touch.axis === "horizontal") event.preventDefault(); }}
            onPointerDown={(event) => { if (event.pointerType === "mouse" || (event.target as HTMLElement).closest("a")) return; touchRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, axis: "pending" }; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerUp={(event) => { const touch = touchRef.current; if (touch.pointerId !== event.pointerId) return; const dx = event.clientX - touch.startX; if (touch.axis === "horizontal" && Math.abs(dx) > 48) move(dx < 0 ? 1 : -1); touch.pointerId = -1; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
            onPointerCancel={(event) => { touchRef.current.pointerId = -1; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}>
            {filtered.map((account, index) => {
              const position = index - selectedIndex;
              const depth = Math.min(Math.abs(position), 2);
              const visible = Math.abs(position) <= 2;
              const x = position === 0 ? "-50%" : position === -1 ? "-50% - clamp(145px,27vw,340px)" : position === 1 ? "-50% + clamp(145px,27vw,340px)" : position < 0 ? "-50% - clamp(245px,44vw,560px)" : "-50% + clamp(245px,44vw,560px)";
              const scale = depth === 0 ? 1 : depth === 1 ? .94 : .9;
              const opacity = visible ? depth === 0 ? 1 : depth === 1 ? .82 : .62 : 0;
              const horizontalBias = position === 0 ? "0px" : focusEdgeBias;
              const style = { transform: `translate(calc(${x} + ${horizontalBias}),calc(-50% + ${depth * 7}px)) scale(${scale})`, opacity, zIndex: 30 - depth * 10, filter: `brightness(${depth === 0 ? 1 : depth === 1 ? .94 : .86})`, pointerEvents: position === 0 ? "auto" as const : "none" as const, transition: getFocusCardTransition(reducedMotion) };
              return <div key={account.id} aria-hidden={position === 0 ? undefined : true} className="absolute left-1/2 top-1/2 w-[88%] max-w-[480px]" style={style}><FocusCoverCard account={account} labels={labels} active={position === 0} /></div>;
            })}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-[25] w-10 bg-gradient-to-r from-bg-base to-transparent transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none sm:w-16 lg:w-24" style={{ opacity: filtered.length <= 1 || isAtStart ? 0 : 1 }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-[25] w-10 bg-gradient-to-l from-bg-base to-transparent transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none sm:w-16 lg:w-24" style={{ opacity: filtered.length <= 1 || isAtEnd ? 0 : 1 }} />
          </div>
          </div>
          <FocusNavigationControls index={selectedIndex} accountCount={filtered.length} onMove={move} />
        </div>
      )}
      <style>{`@keyframes filter-step-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(calc(var(--filter-direction) * 5px)); } } @keyframes filter-step-in { from { opacity: 0; transform: translateX(calc(var(--filter-direction) * -5px)); } to { opacity: 1; transform: translateX(0); } } @media (prefers-reduced-motion: reduce) { .account-library [class*="transition-"] { transition-duration: 0.01ms !important; } }`}</style>
    </section>
  );
}
