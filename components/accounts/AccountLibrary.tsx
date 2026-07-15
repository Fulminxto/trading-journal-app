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
  initialBalance: string;
  pnl: string;
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

function GridAccountCard({ account, labels }: { account: AccountLibraryItem; labels: Labels }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <IconTile interactive={false}><Wallet size={20} /></IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-micro uppercase tracking-label text-muted">
            <span className="text-accent-bright">{account.type}</span><span className="text-muted-faint"> · </span>{account.status}<span className="text-muted-faint"> · </span>{account.membershipRole}
          </p>
          <h3 aria-label={account.name} title={account.name} className="mt-1.5 line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-7 text-white">{account.name}</h3>
        </div>
        <AccountActionsMenu
          accountId={account.id}
          accountName={account.name}
          accountStatus={account.status}
          canOpenManage={account.canOpenManage}
          canViewMembers={account.canViewMembers}
          canManageIntegrations={account.canManageIntegrations}
          canArchiveAccount={account.canArchiveAccount}
          canDeleteAccount={account.canDeleteAccount}
          placement="grid"
        />
      </div>
      <div className="mt-3"><p className="text-xs text-muted-faint">{labels.pnl}</p><p className={`mt-0.5 text-3xl font-black leading-tight ${getPnlTone(account.pnlValue)}`}>{account.pnl}</p></div>
      <div className="mt-3.5 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/[0.06] pt-3.5 text-xs">
        <div><p className="flex items-center gap-1.5 text-muted-faint"><TrendingUp size={13} aria-hidden="true" />{labels.initialBalance}</p><p className="mt-1 text-muted">{account.initialBalance}</p></div>
        <div><p className="flex items-center gap-1.5 text-muted-faint"><Activity size={13} aria-hidden="true" />{labels.trades}</p><p className="mt-1 text-muted">{account.formattedTradeCount}</p></div>
        <div><p className="flex items-center gap-1.5 text-muted-faint"><Shield size={13} aria-hidden="true" />{labels.winRate}</p><p className={`mt-1 ${getWinRateTone(account.winRateValue)}`}>{account.winRate ?? labels.notMeasured}</p></div>
        <div><p className="flex items-center gap-1.5 text-muted-faint"><Users size={13} aria-hidden="true" />{getMembersHeading(labels)}</p><p className="mt-1 text-muted">{getMemberCountLabel(account, labels)}</p></div>
      </div>
      <Link href={`/accounts/${account.id}/dashboard`} className="mt-4 block rounded-inner bg-accent px-4 py-3 text-center text-sm font-semibold text-white outline-none transition-colors duration-base hover:bg-accent-bright focus-visible:ring-2 focus-visible:ring-accent-bright/70">{labels.openAccount}</Link>
    </Card>
  );
}

function FocusCoverCard({ account, labels, active }: { account: AccountLibraryItem; labels: Labels; active: boolean }) {
  return (
    <article className={`relative h-[340px] w-full overflow-hidden rounded-card border bg-surface-1 sm:h-[330px] ${active ? "border-flash/[0.18] shadow-[0_28px_80px_-46px_rgba(0,0,0,.42)]" : "border-flash/[0.15] shadow-[0_24px_68px_-44px_rgba(0,0,0,.34)]"}`}>
      <div className="absolute inset-y-0 right-0 w-[60%] opacity-80 sm:w-[52%]">
        <AccountCover account={account} active={active} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,14,1)_0%,rgba(3,7,14,.96)_38%,rgba(3,7,14,.68)_68%,rgba(3,7,14,.34)_100%),linear-gradient(0deg,rgba(3,7,14,.8)_0%,transparent_58%)]" />
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex min-h-8 items-start justify-between gap-3 pr-9">
          <div className="flex flex-wrap items-center gap-2 text-micro uppercase tracking-label">
          <span className="text-accent-bright">{account.type}</span><span className="text-muted-faint">·</span><span className={active ? "text-muted" : "text-muted/80"}>{account.status}</span><span className="text-muted-faint">·</span><span className={active ? "text-muted" : "text-muted/80"}>{account.membershipRole}</span>
          </div>
        </div>
        {active && <AccountActionsMenu accountId={account.id} accountName={account.name} accountStatus={account.status} canOpenManage={account.canOpenManage} canViewMembers={account.canViewMembers} canManageIntegrations={account.canManageIntegrations} canArchiveAccount={account.canArchiveAccount} canDeleteAccount={account.canDeleteAccount} placement="focus" className="absolute right-3 top-3 z-40 sm:right-4 sm:top-4" />}
        <div className={`mt-3 grid gap-4 sm:mt-4 ${active ? "sm:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] sm:gap-6" : "max-w-[68%]"}`}>
          <div className="min-w-0">
            <h3 aria-label={account.name} title={account.name} className={`line-clamp-2 font-semibold text-flash ${active ? "text-xl leading-6 sm:text-2xl sm:leading-7" : "text-lg leading-6 sm:text-xl"}`}>{account.name}</h3>
            <div className="mt-2"><p className="text-micro text-muted-faint">{labels.pnl}</p><p className={`mt-0.5 font-semibold tabular-nums ${getPnlTone(account.pnlValue)} ${active ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}>{account.pnl}</p></div>
          </div>
          {active && <div className="min-w-0">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div><p className="flex items-center gap-1 text-micro text-muted-faint"><TrendingUp size={12} aria-hidden="true" />{labels.initialBalance}</p><p className="mt-1 truncate text-xs font-semibold tabular-nums text-flash">{account.initialBalance}</p></div>
              <div><p className="flex items-center gap-1 text-micro text-muted-faint"><Activity size={12} aria-hidden="true" />{labels.trades}</p><p className="mt-1 text-xs font-semibold tabular-nums text-flash">{account.formattedTradeCount}</p></div>
              <div><p className="flex items-center gap-1 text-micro text-muted-faint"><Shield size={12} aria-hidden="true" />{labels.winRate}</p><p className={`mt-1 truncate text-xs font-semibold tabular-nums ${getWinRateTone(account.winRateValue)}`}>{account.winRate ?? labels.notMeasured}</p></div>
              <div><p className="flex items-center gap-1 text-micro text-muted-faint"><Users size={12} aria-hidden="true" />{getMembersHeading(labels)}</p><p className="mt-1 truncate text-xs font-semibold tabular-nums text-flash">{getMemberCountLabel(account, labels)}</p></div>
            </div>
            <div className="mt-4 text-right"><Link href={`/accounts/${account.id}/dashboard`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-inner bg-accent px-5 py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-accent-bright focus-visible:ring-2 focus-visible:ring-accent-bright/70 sm:w-auto">{labels.openAccount}<ArrowRight size={16} aria-hidden="true" /></Link></div>
          </div>}
        </div>
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
  const [pointerRatio, setPointerRatio] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hoverIntent = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const move = useCallback((delta: number) => setSelectedIndex((index) => Math.max(0, Math.min(filtered.length - 1, index + delta))), [filtered.length]);
  const clearHoverIntent = useCallback(() => {
    if (hoverIntent.current) clearTimeout(hoverIntent.current);
    hoverIntent.current = null;
  }, []);
  const selectWithIntent = useCallback((index: number) => {
    clearHoverIntent();
    hoverIntent.current = setTimeout(() => setSelectedIndex(index), 170);
  }, [clearHoverIntent]);

  useEffect(() => clearHoverIntent, [clearHoverIntent]);

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
          onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}
        >
          <p className="sr-only" aria-live="polite">{selected.name}, account {selectedIndex + 1} of {filtered.length}</p>
          <div ref={carouselRef} className="relative mx-auto h-[360px] max-w-[1280px] touch-pan-y overflow-hidden select-none"
            onPointerMove={(event) => { if (event.pointerType === "mouse" && !reducedMotion) { const bounds = event.currentTarget.getBoundingClientRect(); setPointerRatio(Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1))); } const touch = touchRef.current; if (touch.pointerId !== event.pointerId) return; const dx = event.clientX - touch.startX; const dy = event.clientY - touch.startY; if (touch.axis === "pending" && Math.hypot(dx, dy) > 8) touch.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? "horizontal" : "vertical"; if (touch.axis === "horizontal") event.preventDefault(); }}
            onPointerLeave={() => { clearHoverIntent(); setPointerRatio(0); }}
            onPointerDown={(event) => { if (event.pointerType === "mouse" || (event.target as HTMLElement).closest("a")) return; touchRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, axis: "pending" }; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerUp={(event) => { const touch = touchRef.current; if (touch.pointerId !== event.pointerId) return; const dx = event.clientX - touch.startX; if (touch.axis === "horizontal" && Math.abs(dx) > 48) move(dx < 0 ? 1 : -1); touch.pointerId = -1; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
            onPointerCancel={(event) => { touchRef.current.pointerId = -1; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}>
            {filtered.map((account, index) => {
              const position = index - selectedIndex;
              const depth = Math.min(Math.abs(position), 2);
              const visible = Math.abs(position) <= 2;
              const x = position === 0 ? "-50%" : position === -1 ? "-50% - clamp(145px,27vw,340px)" : position === 1 ? "-50% + clamp(145px,27vw,340px)" : position < 0 ? "-50% - clamp(245px,44vw,560px)" : "-50% + clamp(245px,44vw,560px)";
              const scale = depth === 0 ? 1 : depth === 1 ? .85 : .73;
              const opacity = visible ? depth === 0 ? 1 : depth === 1 ? .7 : .36 : 0;
              const parallax = reducedMotion ? 0 : pointerRatio * (depth === 0 ? 8 : depth === 1 ? 5 : 3);
              const style = { transform: `translate(calc(${x} + ${focusEdgeBias} + ${parallax}px),calc(-50% + ${depth * 7}px)) scale(${scale})`, opacity, zIndex: 30 - depth * 10, filter: `brightness(${depth === 0 ? 1 : depth === 1 ? .86 : .72})`, pointerEvents: visible ? "auto" as const : "none" as const, transition: reducedMotion ? "opacity 80ms linear" : "transform 560ms cubic-bezier(.2,.72,.22,1), opacity 520ms ease, filter 560ms ease" };
              return <div key={account.id} className="absolute left-1/2 top-1/2 w-[88%] max-w-[480px]" style={style}>{position === 0 ? <FocusCoverCard account={account} labels={labels} active /> : <button type="button" aria-label={`Select ${account.name}`} onPointerEnter={(event) => { if (event.pointerType === "mouse") selectWithIntent(index); }} onPointerLeave={clearHoverIntent} onClick={() => setSelectedIndex(index)} className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/80"><FocusCoverCard account={account} labels={labels} active={false} /></button>}</div>;
            })}
          </div>
          <p aria-hidden="true" className="mt-1 text-center text-xs tracking-[0.08em]"><span className="font-medium tabular-nums text-flash/80">{selectedIndex + 1}</span><span className="text-muted-faint"> of {filtered.length}</span></p>
        </div>
      )}
      <style>{`@keyframes filter-step-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(calc(var(--filter-direction) * 5px)); } } @keyframes filter-step-in { from { opacity: 0; transform: translateX(calc(var(--filter-direction) * -5px)); } to { opacity: 1; transform: translateX(0); } } @media (prefers-reduced-motion: reduce) { .account-library [class*="transition-"] { transition-duration: 0.01ms !important; } }`}</style>
    </section>
  );
}
