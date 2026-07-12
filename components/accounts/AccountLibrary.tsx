"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
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

const VIEW_KEY = "voltis-account-library-view";
type LibraryView = "focus" | "gallery" | "grid";

export type AccountLibraryItem = {
  id: string;
  name: string;
  type: string;
  status: string;
  role: string;
  broker: string | null;
  pnl: string;
  pnlValue: number;
  balance: string;
  totalTrades: string;
  totalTradesValue: number;
  winRate: string | null;
  winRateValue: number | null;
  members: string;
  membersValue: number;
  updatedAt: string;
  isShared: boolean;
};

type Labels = {
  role: string;
  balance: string;
  trades: string;
  winRateShort: string;
  members: string;
  accountPnl: string;
  openAccount: string;
  archived: string;
};

function AccountCover({ account }: { account: AccountLibraryItem }) {
  const seed = [...account.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const shift = 18 + (seed % 36);
  const isShared = account.type === "SHARED" || account.membersValue > 1;
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
        ) : isShared ? (
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(2,6,12,.16)_52%,rgba(2,6,12,.95)_100%)]" />
    </div>
  );
}

function GridAccountCard({ account, labels }: { account: AccountLibraryItem; labels: Labels }) {
  return (
    <Card interactive className="p-6">
      <Link href={`/accounts/${account.id}/dashboard`}>
        <div className="mb-6 flex items-center justify-between">
          <IconTile><Wallet size={20} /></IconTile>
          <div className="flex gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">{account.type}</span>
            {account.status === "ARCHIVED" && <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-muted">{labels.archived}</span>}
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div><h3 className="text-xl font-bold text-white transition-colors duration-base group-hover:text-accent-bright">{account.name}</h3><p className="mt-1 text-sm text-muted-faint">{labels.role}: {account.role}</p></div>
          <ArrowRight size={18} className="mt-1 shrink-0 text-muted transition-all duration-base group-hover:translate-x-1 group-hover:text-accent-bright" />
        </div>
        <div className="mt-5"><p className="text-xs text-muted-faint">{labels.accountPnl}</p><p className={`mt-1 text-3xl font-black ${account.pnlValue > 0 ? "text-accent" : account.pnlValue < 0 ? "text-red-400" : "text-muted"}`}>{account.pnl}</p></div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted"><TrendingUp size={13} />{account.balance}</span>
          <span className="flex items-center gap-1.5 text-muted"><Activity size={13} />{account.totalTrades} {labels.trades}</span>
          <span className={`flex items-center gap-1.5 ${account.winRateValue === null ? "text-muted" : account.winRateValue >= 50 ? "text-accent" : "text-red-400"}`}><Shield size={13} />{account.winRate ?? "Not measured"} {account.winRate ? labels.winRateShort : ""}</span>
          <span className="flex items-center gap-1.5 text-muted"><Users size={13} />{account.members}</span>
        </div>
      </Link>
      <Link href={`/accounts/${account.id}/dashboard`} className="mt-5 block rounded-inner bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-base hover:bg-accent-bright">{labels.openAccount}</Link>
    </Card>
  );
}

function FocusCoverCard({ account, labels, active }: { account: AccountLibraryItem; labels: Labels; active: boolean }) {
  return (
    <article className={`relative aspect-square h-full w-full overflow-hidden rounded-card border bg-surface-1 ${active ? "border-flash/[0.18] shadow-[0_24px_65px_rgba(0,0,0,.5),0_0_35px_rgba(91,224,255,.07)]" : "border-flash/[0.11] shadow-[0_14px_36px_rgba(0,0,0,.32)]"}`}>
      <AccountCover account={account} />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-micro uppercase tracking-label">
          <span className="text-accent-bright">{account.type}</span><span className="text-muted-faint">·</span><span className="text-muted">{account.status}</span><span className="text-muted-faint">·</span><span className="text-muted">{account.role}</span>
        </div>
        <h3 className={`mt-2 truncate font-semibold text-flash ${active ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>{account.name}</h3>
        {!active && <p className={`mt-2 text-sm font-semibold tabular-nums ${account.pnlValue >= 0 ? "text-accent-bright/80" : "text-red-300/80"}`}>{account.pnl}</p>}
        {active && <><div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-flash/[0.1] pt-4 sm:grid-cols-4">
          <div><p className="text-micro text-muted-faint">PnL</p><p className={`mt-1 font-semibold tabular-nums ${account.pnlValue > 0 ? "text-accent" : account.pnlValue < 0 ? "text-red-400" : "text-muted"}`}>{account.pnl}</p></div>
          <div><p className="text-micro text-muted-faint">{labels.balance}</p><p className="mt-1 font-semibold tabular-nums text-flash">{account.balance}</p></div>
          <div><p className="text-micro text-muted-faint">{labels.trades}</p><p className="mt-1 font-semibold tabular-nums text-flash">{account.totalTrades}</p></div>
          {account.winRateValue !== null ? <div><p className="text-micro text-muted-faint">{labels.winRateShort}</p><p className="mt-1 font-semibold tabular-nums text-flash">{account.winRate}</p></div> : account.isShared ? <div><p className="text-micro text-muted-faint">{labels.members}</p><p className="mt-1 font-semibold tabular-nums text-flash">{account.members}</p></div> : null}
        </div></>}
        {active && <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted">{account.membersValue > 1 || account.type === "SHARED" ? `${account.members} ${labels.members.toLowerCase()}` : `Updated ${account.updatedAt}`}</p>
          <Link href={`/accounts/${account.id}/dashboard`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-inner bg-accent px-5 py-3 text-sm font-semibold text-white outline-none transition-colors hover:bg-accent-bright focus-visible:ring-2 focus-visible:ring-accent-bright/70 sm:w-auto">{labels.openAccount}<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>}
      </div>
    </article>
  );
}

function AccountTypeMenu({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const items = useMemo(() => [{ value: "ALL", label: "All types" }, ...options.map((item) => ({ value: item, label: item }))], [options]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  const openMenu = () => {
    setActiveIndex(Math.max(0, items.findIndex((item) => item.value === value)));
    setOpen(true);
  };
  const select = (next: string) => {
    onChange(next);
    setOpen(false);
    queueMicrotask(() => buttonRef.current?.focus());
  };
  const handleListKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : items.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(items[activeIndex].value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === "Tab") setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <span id={`${listboxId}-label`} className="sr-only">Account type</span>
      <button ref={buttonRef} type="button" aria-labelledby={`${listboxId}-label ${listboxId}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={listboxId} onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={(event) => { if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp")) { event.preventDefault(); openMenu(); } }} className="flex min-h-11 min-w-44 items-center justify-between gap-3 rounded-inner border-[0.5px] border-flash/[0.14] bg-surface-2 px-3 text-xs text-flash outline-none hover:border-flash/25 focus-visible:ring-2 focus-visible:ring-accent-bright/60">
        <span className="flex gap-2"><span className="text-muted">Account type</span><span id={`${listboxId}-value`}>{items.find((item) => item.value === value)?.label}</span></span>
        <ChevronDown size={14} aria-hidden="true" className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div id={listboxId} role="listbox" aria-labelledby={`${listboxId}-label`} onKeyDown={handleListKey} className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-full overflow-hidden rounded-inner border-[0.5px] border-flash/[0.16] bg-[#08111d] p-1.5 shadow-[0_18px_45px_rgba(0,0,0,.55)]">
        {items.map((item, index) => <button ref={(node) => { optionRefs.current[index] = node; }} key={item.value} type="button" role="option" aria-selected={value === item.value} onPointerMove={() => setActiveIndex(index)} onClick={() => select(item.value)} className={`flex min-h-9 w-full items-center justify-between gap-4 rounded-md px-3 text-left text-xs outline-none ${activeIndex === index ? "bg-white/[0.07] text-flash" : "text-muted hover:bg-white/[0.04] hover:text-flash"} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60`}>
          <span>{item.label}</span>{value === item.value && <span className="flex items-center gap-1.5 text-accent-bright"><Check size={13} aria-hidden="true" /><span className="sr-only">Selected</span></span>}
        </button>)}
      </div>}
    </div>
  );
}

export default function AccountLibrary({ accounts, labels }: { accounts: AccountLibraryItem[]; labels: Labels }) {
  const [view, setView] = useState<LibraryView>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"ALL" | "PERSONAL" | "SHARED" | "PROP">("ALL");
  const [type, setType] = useState("ALL");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pointerRatio, setPointerRatio] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hoverIntent = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchRef = useRef({ pointerId: -1, startX: 0, startY: 0, axis: "pending" as "pending" | "horizontal" | "vertical" });
  const railRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const types = useMemo(() => [...new Set(accounts.map((account) => account.type))].sort(), [accounts]);

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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return accounts.filter((account) => {
      if (account.status !== "ACTIVE") return false;
      if (category === "SHARED" && !account.isShared) return false;
      if (category === "PERSONAL" && (account.isShared || ["PROP", "CHALLENGE", "FUNDED"].includes(account.type))) return false;
      if (category === "PROP" && !["PROP", "CHALLENGE", "FUNDED"].includes(account.type)) return false;
      if (type !== "ALL" && account.type !== type) return false;
      return !term || account.name.toLowerCase().includes(term) || account.type.toLowerCase().includes(term) || account.broker?.toLowerCase().includes(term);
    });
  }, [accounts, category, search, type]);

  const selected = filtered[selectedIndex];
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

  useEffect(() => {
    railRefs.current[selectedIndex]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "nearest" });
  }, [reducedMotion, selectedIndex]);

  return (
    <section aria-labelledby="account-library-title" className="account-library reveal-rise" style={{ animationDelay: "100ms" }}>
      <div className="mb-5">
        <p className="text-micro uppercase tracking-label text-accent-bright">Account library</p>
        <h2 id="account-library-title" className="mt-2 text-section text-flash">Choose your workspace</h2>
      </div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm"><span className="sr-only">Search accounts</span><Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedIndex(0); }} placeholder="Search accounts" className="w-full rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-flash outline-none placeholder:text-muted-faint focus:border-accent-bright/50 focus:ring-2 focus:ring-accent-bright/30" /></label>
        <div className="flex min-w-0 gap-3 overflow-x-auto pb-1">
          <div aria-label="Account category" className="flex shrink-0 gap-1 rounded-pill border-[0.5px] border-flash/[0.08] bg-surface-2/70 p-1">
            {([['ALL', 'All accounts'], ['PERSONAL', 'Personal'], ['SHARED', 'Shared'], ['PROP', 'Prop firms']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setSelectedIndex(0); }} className={`min-h-9 rounded-pill px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${category === value ? "bg-accent/15 text-accent-bright" : "text-muted hover:text-flash"}`}>{label}</button>)}
          </div>
          <AccountTypeMenu value={type} options={types} onChange={(next) => { setType(next); setSelectedIndex(0); }} />
          <div role="group" aria-label="Library view" className="flex shrink-0 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 p-1">
            <button type="button" aria-pressed={view === "focus"} onClick={() => chooseView("focus")} className={`flex min-h-9 items-center gap-2 rounded-inner px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${view === "focus" ? "bg-accent/15 text-accent-bright" : "text-muted"}`}><Sparkles size={14} />Focus</button>
            <button type="button" aria-pressed={view === "grid"} onClick={() => chooseView("grid")} className={`flex min-h-9 items-center gap-2 rounded-inner px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${view === "grid" ? "bg-accent/15 text-accent-bright" : "text-muted"}`}><Grid2X2 size={14} />Grid</button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card variant="inner" className="border-dashed p-8 text-center"><h3 className="text-subsection text-flash">No accounts found</h3><p className="mt-2 text-caption text-muted">Try adjusting your search or account filters.</p><button type="button" onClick={() => { setSearch(""); setType("ALL"); setCategory("ALL"); setSelectedIndex(0); }} className="mt-4 rounded-inner border-[0.5px] border-accent/30 px-4 py-2 text-sm text-accent-bright">Clear filters</button></Card>
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
          <div ref={carouselRef} className="relative mx-auto h-[min(92vw,590px)] min-h-[350px] max-w-[1280px] touch-pan-y overflow-hidden select-none"
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
              const opacity = visible ? depth === 0 ? 1 : depth === 1 ? .58 : .25 : 0;
              const parallax = reducedMotion ? 0 : pointerRatio * (depth === 0 ? 8 : depth === 1 ? 5 : 3);
              const style = { transform: `translate(calc(${x} + ${parallax}px),calc(-50% + ${depth * 7}px)) scale(${scale})`, opacity, zIndex: 30 - depth * 10, filter: `brightness(${depth === 0 ? 1 : depth === 1 ? .76 : .6})`, pointerEvents: visible ? "auto" as const : "none" as const, transition: reducedMotion ? "opacity 80ms linear" : "transform 560ms cubic-bezier(.2,.72,.22,1), opacity 520ms ease, filter 560ms ease" };
              return <div key={account.id} className="absolute left-1/2 top-1/2 w-[88%] max-w-[540px]" style={style}>{position === 0 ? <FocusCoverCard account={account} labels={labels} active /> : <button type="button" aria-label={`Select ${account.name}`} onPointerEnter={(event) => { if (event.pointerType === "mouse") selectWithIntent(index); }} onPointerLeave={clearHoverIntent} onClick={() => setSelectedIndex(index)} className="block h-full w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/80"><FocusCoverCard account={account} labels={labels} active={false} /></button>}</div>;
            })}
          </div>
          <div className="mt-3 text-center text-caption tabular-nums text-muted">{selectedIndex + 1} of {filtered.length}</div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Select account">
            {filtered.map((account, index) => <button ref={(node) => { railRefs.current[index] = node; }} key={account.id} type="button" role="tab" aria-selected={index === selectedIndex} aria-current={index === selectedIndex ? "true" : undefined} onClick={() => setSelectedIndex(index)} className={`min-h-10 shrink-0 rounded-pill border-[0.5px] px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 ${index === selectedIndex ? "border-accent/35 bg-accent/10 text-accent-bright" : "border-flash/[0.08] text-muted"}`}>{account.name}<span className="sr-only">, {index === selectedIndex ? "selected" : `account ${index + 1}`}</span></button>)}
          </div>
        </div>
      )}
      <style>{`@media (prefers-reduced-motion: reduce) { .account-library [class*="transition-"] { transition-duration: 0.01ms !important; } }`}</style>
    </section>
  );
}
