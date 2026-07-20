"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import AccountLifecycleList, { AccountDataTableHeader, DATA_TABLE_ROW, type LifecycleAccount, type LifecycleLabels } from "@/components/accounts/AccountLifecycleList";

export type { LifecycleAccount, LifecycleLabels } from "@/components/accounts/AccountLifecycleList";

type DeletedPreview = { name: string; type: string; currency: string; daysRemaining: number };
type TabId = "active" | "archived" | "deleted";

const tabs: { id: TabId; label: string }[] = [
  { id: "active", label: "Active Accounts" },
  { id: "archived", label: "Archived" },
  { id: "deleted", label: "Recently Deleted" },
];

export default function AccountLifecycleManager({ activeAccounts, archivedAccounts, recentlyDeletedPreview, labels }: {
  activeAccounts: LifecycleAccount[];
  archivedAccounts: LifecycleAccount[];
  recentlyDeletedPreview: DeletedPreview | null;
  labels: LifecycleLabels;
}) {
  const [selectedTab, setSelectedTab] = useState<TabId>("active");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectAdjacentTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setSelectedTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return <section className="rounded-2xl border border-white/[0.05] bg-[#070d19]/40" aria-label="Account lifecycle management">
    <div role="tablist" aria-label="Account lifecycle views" className="mx-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-white/[0.05] pt-6">
      {tabs.map((tab, index) => {
        const selected = selectedTab === tab.id;
        return <button key={tab.id} ref={(element) => { tabRefs.current[index] = element; }} type="button" role="tab" id={`account-tab-${tab.id}`} aria-controls={`account-panel-${tab.id}`} aria-selected={selected} tabIndex={selected ? 0 : -1} onClick={() => setSelectedTab(tab.id)} onKeyDown={(event) => selectAdjacentTab(event, index)} className={`relative pb-3 text-micro font-semibold uppercase tracking-label outline-none transition-colors duration-200 focus-visible:text-cyan-300 ${selected ? "text-cyan-400 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-cyan-400 after:content-['']" : "text-slate-500 hover:text-slate-300"}`}>{tab.label}</button>;
      })}
    </div>
    <div role="tabpanel" id="account-panel-active" aria-labelledby="account-tab-active" tabIndex={selectedTab === "active" ? 0 : -1} hidden={selectedTab !== "active"} className="px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/40">
      {activeAccounts.length > 0 ? <AccountLifecycleList accounts={activeAccounts} labels={labels} /> : <p className="py-3 text-sm text-slate-500">No active accounts</p>}
    </div>
    <div role="tabpanel" id="account-panel-archived" aria-labelledby="account-tab-archived" tabIndex={selectedTab === "archived" ? 0 : -1} hidden={selectedTab !== "archived"} className="px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/40">
      {archivedAccounts.length > 0 ? <AccountLifecycleList accounts={archivedAccounts} labels={labels} /> : <p className="py-3 text-sm text-slate-500">No archived accounts</p>}
    </div>
    <div role="tabpanel" id="account-panel-deleted" aria-labelledby="account-tab-deleted" tabIndex={selectedTab === "deleted" ? 0 : -1} hidden={selectedTab !== "deleted"} className="px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/40">
      {recentlyDeletedPreview ? <div role="table" aria-label="Recently deleted accounts"><AccountDataTableHeader /><div role="row" className={`${DATA_TABLE_ROW} border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]`}><h3 role="cell" className="min-w-0 truncate text-left text-sm font-medium text-slate-400 md:w-[30%]">{recentlyDeletedPreview.name}</h3><p role="cell" className="text-left text-xs text-slate-600 md:w-[20%]">{recentlyDeletedPreview.type} <span aria-hidden="true">•</span> {recentlyDeletedPreview.currency}</p><span role="cell" className="text-left text-xs text-slate-600 md:w-[15%]">—</span><div role="cell" className="flex items-center text-left md:w-[15%]"><span className="inline-flex w-fit whitespace-nowrap rounded border border-red-900/30 bg-red-950/20 px-2 py-0.5 text-[10px] font-medium tracking-wide text-red-400/80">Deletes in {recentlyDeletedPreview.daysRemaining} days</span></div><div role="cell" className="flex items-center justify-end gap-3 text-right md:w-[20%]"><button type="button" aria-disabled="true" aria-label="Restore is unavailable in this visual prototype" className="inline-flex min-h-8 items-center justify-center px-2 text-xs font-medium text-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/40">Restore</button></div></div></div> : <p className="py-3 text-sm text-slate-500">No recently deleted accounts</p>}
    </div>
  </section>;
}
