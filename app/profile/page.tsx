import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  Clock3,
  IdCard,
  KeyRound,
  LineChart,
  Monitor,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

import GlobalToast from "@/components/GlobalToast";
import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import {
  formatCurrencyByLanguage,
  formatDateTimeByLanguage,
  normalizeAppLanguage,
} from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "./ChangePasswordForm";
import ProfileTabs from "./ProfileTabs";
import { updateProfile } from "./actions";
import {
  buildProfileReadiness,
  formatProfileHeaderDateTime,
} from "./profile-model";

type Tone = "neutral" | "info" | "positive" | "negative";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isOnline(date?: Date | null) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 5 * 60 * 1000;
}

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const tones = {
    neutral: "border-flash/[0.12] bg-surface-2 text-muted",
    info: "border-accent-bright/25 bg-accent-bright/[0.08] text-accent-bright",
    positive: "border-positive/25 bg-positive/[0.08] text-positive",
    negative: "border-negative/25 bg-negative/[0.08] text-negative",
  };

  return (
    <span
      className={`inline-flex items-center rounded-pill border-[0.5px] px-3 py-1 text-micro font-medium uppercase tracking-label ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <SignatureEdge orientation="vertical" className="h-4" />
          <p className="text-micro uppercase tracking-label text-accent-bright">
            {eyebrow}
          </p>
        </div>
        <h2 className="mt-2 text-section text-flash">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  const toneClass =
    tone === "positive"
      ? "text-positive"
      : tone === "negative"
        ? "text-negative"
        : "text-flash";

  return (
    <Card className="reveal-rise p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-micro uppercase tracking-label text-muted-faint">
            {label}
          </p>
          <p className={`mt-3 text-metric tabular-nums ${toneClass}`}>
            {value}
          </p>
          <p className="mt-2 text-caption leading-5 text-muted">{detail}</p>
        </div>
        <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-inner border-[0.5px] border-dashed border-flash/[0.12] bg-surface-2 p-5">
      <p className="text-body font-medium text-flash">{title}</p>
      <p className="mt-2 text-caption leading-5 text-muted">{description}</p>
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  required = false,
  step,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  placeholder: string;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder: string;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
      />
    </label>
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{
    toast?: string;
  }>;
}) {
  const query = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      memberships: {
        include: {
          tradingAccount: {
            include: {
              trades: true,
              members: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const appLanguage = normalizeAppLanguage(user.appLanguage);
  const currency = user.defaultCurrency ?? "USD";
  const displayName = user.name || user.username;
  const initials = getInitials(displayName);
  const online = isOnline(user.lastActivityAt);

  const accounts = user.memberships.map(
    (membership) => membership.tradingAccount
  );
  const allTrades = accounts.flatMap((account) => account.trades);
  const totalAccounts = accounts.length;
  const totalTrades = allTrades.length;
  const totalPnl = allTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );
  const wins = allTrades.filter((trade) => trade.outcome === "win").length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : null;

  const headerCompletionItems = [
    user.name,
    user.username,
    user.bio,
    user.workspaceName,
    user.tradingStyle,
    user.favoriteMarket,
    user.timezone,
    user.preferredSession,
    user.riskPerTrade,
    user.preferredBroker,
    user.setupStyle,
  ];
  const headerProfileCompletion = Math.round(
    (headerCompletionItems.filter(Boolean).length / headerCompletionItems.length) * 100
  );
  const hasText = (value?: string | null) => Boolean(value?.trim());
  const readiness = buildProfileReadiness(user);
  const tradingPassportRows = [
    { label: "Style", value: user.tradingStyle ?? "" },
    { label: "Favorite Market", value: user.favoriteMarket ?? "" },
    { label: "Preferred Session", value: user.preferredSession ?? "" },
    { label: "Risk", value: user.riskPerTrade === null ? "" : `${user.riskPerTrade}%` },
    { label: "Broker", value: user.preferredBroker ?? "" },
  ];
  const currentSetupRows = [
    { label: "Risk", value: user.riskPerTrade === null ? "Not set" : `${user.riskPerTrade}%` },
    { label: "Market", value: hasText(user.favoriteMarket) ? user.favoriteMarket : "Not set" },
    { label: "Style", value: hasText(user.tradingStyle) ? user.tradingStyle : "Not set" },
  ];
  const formatCurrency = (value: number) =>
    formatCurrencyByLanguage(value, currency, appLanguage);
  const formatDateTime = (date?: Date | null) =>
    date ? formatDateTimeByLanguage(date, appLanguage) : "Never";
  const securityRows: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
  }> = [
    { label: "Authentication", value: "Protected", icon: ShieldCheck },
    { label: "System role", value: user.role, icon: IdCard },
    { label: "Email", value: user.email ? user.email : "Not set", icon: BadgeCheck },
    {
      label: "Last activity",
      value: formatDateTime(user.lastActivityAt),
      icon: Clock3,
    },
    { label: "Login count", value: String(user.loginCount), icon: Briefcase },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <GlobalToast status={query.toast} language={appLanguage} />

      <div>
        <p className="text-micro uppercase tracking-hero text-muted-faint">
          Private identity / account surface
        </p>
        <h1 className="mt-3 text-hero text-flash">Profile</h1>
        <div className="mt-4 max-w-3xl">
          <SignatureEdge orientation="horizontal" className="mb-4 max-w-40" />
          <p className="text-body text-muted">
            Manage the private identity, access posture, and operating
            preferences attached to your VOLTIS account.
          </p>
        </div>
      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-card border-[0.5px] border-flash/[0.12] bg-surface-2">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-metric-lg text-accent-bright">
                  {initials}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-section text-flash">{displayName}</h2>
                <StatusPill tone={online ? "info" : "neutral"}>
                  {online ? "Online" : "Offline"}
                </StatusPill>
              </div>
              <p className="mt-2 text-body text-muted">@{user.username}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill>{user.role}</StatusPill>
                <StatusPill tone="info">{headerProfileCompletion}% complete</StatusPill>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Last login
              </p>
              <p className="mt-2 whitespace-nowrap text-xs leading-5 text-flash">
                {formatProfileHeaderDateTime(user.lastLoginAt, appLanguage)}
              </p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Last activity
              </p>
              <p className="mt-2 whitespace-nowrap text-xs leading-5 text-flash">
                {formatProfileHeaderDateTime(user.lastActivityAt, appLanguage)}
              </p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Logins
              </p>
              <p className="mt-2 text-caption leading-5 text-flash">
                {user.loginCount}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Accounts"
          value={String(totalAccounts)}
          detail="Trading accounts linked to this identity."
          icon={Wallet}
        />
        <StatCard
          label="Trades"
          value={String(totalTrades)}
          detail="Trades available through linked accounts."
          icon={LineChart}
        />
        <StatCard
          label="Total PnL"
          value={totalTrades > 0 ? formatCurrency(totalPnl) : "Not measured"}
          detail="Only calculated when trade data exists."
          icon={TrendingUp}
          tone={totalTrades > 0 && totalPnl > 0 ? "positive" : totalPnl < 0 ? "negative" : "neutral"}
        />
        <StatCard
          label="Win rate"
          value={winRate === null ? "Not measured" : `${winRate.toFixed(2)}%`}
          detail="No fake rate is shown before trades exist."
          icon={Target}
          tone={winRate !== null && winRate >= 50 ? "positive" : winRate !== null ? "negative" : "neutral"}
        />
      </section>

      <ProfileTabs
        general={
          <div className="grid items-stretch gap-6 lg:grid-cols-[3fr_2fr]">
            <Card className="h-full">
              <form action={updateProfile} className="flex h-full flex-col">
                <div className="space-y-7">
                <section>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-surface-2">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-accent-bright">{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-white">Profile Image</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        JPG, PNG, or WEBP. Maximum size: 5MB. Files are validated server-side.
                      </p>
                      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.07] hover:text-white">
                        <Upload size={15} aria-hidden="true" />
                        Upload image
                        <input
                          type="file"
                          name="profileImage"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </section>

                <section className="border-t border-white/[0.05] pt-6">
                  <h2 className="text-sm font-semibold text-white">Personal Details</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TextField name="name" label="Display name" defaultValue={user.name} placeholder="Display name" />
                    <TextField name="username" label="Username" defaultValue={user.username} placeholder="Username" required />
                    <TextField name="workspaceName" label="Workspace name" defaultValue={user.workspaceName} placeholder="Workspace name" />
                    <TextField name="timezone" label="TimeZone" defaultValue={user.timezone} placeholder="Europe/Rome" />
                    <TextAreaField name="bio" label="Bio" defaultValue={user.bio} placeholder="Briefly describe your trader profile." />
                  </div>
                </section>

                <section className="border-t border-white/[0.05] pt-6">
                  <h2 className="text-sm font-semibold text-white">Trading Identity</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SelectField name="tradingStyle" label="Trading style" defaultValue={user.tradingStyle} placeholder="Select style" options={["Scalping", "Day Trading", "Swing Trading", "Position Trading"]} />
                    <SelectField name="favoriteMarket" label="Favorite market" defaultValue={user.favoriteMarket} placeholder="Select market" options={["Forex", "Gold", "Crypto", "Indices", "Commodities"]} />
                    <SelectField name="preferredSession" label="Preferred session" defaultValue={user.preferredSession} placeholder="Select session" options={["Asia", "London", "New York", "Overlap"]} />
                    <TextField name="riskPerTrade" label="Risk per trade %" type="number" step="0.01" defaultValue={user.riskPerTrade} placeholder="1" />
                    <TextField name="preferredBroker" label="Broker" defaultValue={user.preferredBroker} placeholder="Broker / Prop Firm" />
                    <TextField name="setupStyle" label="Setup style" defaultValue={user.setupStyle} placeholder="Breakout, Pullback, SMC" />
                  </div>
                </section>
                </div>

                <div className="mt-7 flex justify-end border-t border-white/[0.05] pt-6">
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55">
                    <Save size={17} />
                    Save profile
                  </button>
                </div>
              </form>
            </Card>

            <Card
              className={
                readiness.percentage < 100
                  ? "h-full flex flex-col justify-between p-6"
                  : "h-full flex flex-col justify-between"
              }
            >
              {readiness.percentage === 100 ? (
                <>
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                          <Check size={15} aria-hidden="true" />
                        </span>
                        <h2 className="text-sm font-semibold text-white">Verified Trader Profile</h2>
                      </div>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                        {readiness.percentage}% Complete
                      </span>
                    </div>
                  </div>

                  <section className="my-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trading Passport</h3>
                    <div className="mt-4 divide-y divide-white/[0.05]">
                      {tradingPassportRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                          <span className="text-xs text-slate-500">{row.label}</span>
                          <span className="max-w-[60%] truncate text-right text-xs font-medium text-slate-200">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Engine Status</h3>
                    <div className="mt-3 divide-y divide-white/[0.05]">
                      {[
                        ["Journaling Engine", "Active"],
                        ["Risk Analytics", "Calibrated"],
                        ["AI Pattern Matching", "Optimal"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                          <span className="min-w-0 flex-1 text-xs text-slate-400">{label}</span>
                          <span className="text-xs font-medium text-slate-200">{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-sm font-semibold text-white">Identity Diagnostic</h2>
                        <p className="mt-1 text-xs text-slate-500">Profile readiness overview</p>
                      </div>
                      <span className="text-xl font-semibold text-cyan-400">{readiness.percentage}%</span>
                    </div>

                    <div
                      role="progressbar"
                      aria-label="Identity readiness"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={readiness.percentage}
                      className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
                    >
                      <div className="h-1.5 rounded-full bg-cyan-400 transition-all" style={{ width: `${readiness.percentage}%` }} />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      {readiness.completedCount} / {readiness.fields.length} fields complete
                    </p>
                  </div>

                  <div className="flex-1 my-6 flex flex-col justify-start gap-3">
                    <h3 className="text-xs font-semibold text-slate-300">Missing information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {readiness.missingFields.map((field) => (
                        <div
                          key={field.label}
                          className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2"
                        >
                          <X size={13} className="shrink-0 text-rose-400" aria-hidden="true" />
                          <span className="text-xs text-slate-300">{field.label}</span>
                          <span className="sr-only">Missing</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3.5 mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Current Setup</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {currentSetupRows.map((item) => {
                        const missing = item.value === "Not set";
                        return (
                          <div key={item.label}>
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">{item.label}</p>
                            <p className={missing ? "mt-1 text-xs text-slate-500" : "mt-1 text-xs font-medium text-slate-200"}>
                              {item.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-auto rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles size={15} className="mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
                      <p className="text-xs leading-relaxed text-slate-400">
                        Completa la tua Trading Identity per personalizzare gli algoritmi di analisi e le metriche del Journal.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        }
        security={
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="h-full">
              <SectionHeader eyebrow="Security" title="Change Password">
                <StatusPill tone="info">Protected</StatusPill>
              </SectionHeader>
              <div className="mt-6"><ChangePasswordForm appLanguage={appLanguage} /></div>
            </Card>

            <Card className="flex flex-col justify-between h-full">
              <div>
                <SectionHeader eyebrow="Access" title="Security Status">
                  <StatusPill>{user.status}</StatusPill>
                </SectionHeader>
                <div className="mt-6 divide-y divide-white/[0.05]">
                  {securityRows.map(({ label, value, icon: RowIcon }) => (
                    <div key={label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <RowIcon size={16} className="shrink-0 text-slate-500" />
                      <p className="min-w-0 flex-1 text-xs text-slate-400">{label}</p>
                      <p className="max-w-[60%] break-words text-right text-xs font-medium text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 divide-y divide-white/[0.05] border-t border-white/[0.05]">
                <div className="flex items-center gap-3 py-3">
                  <Monitor size={16} className="shrink-0 text-slate-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Active Sessions</p>
                    <p className="mt-1 text-xs font-medium text-slate-200">Current authenticated session</p>
                    <p className="mt-1 text-[11px] text-slate-500">Device details are not tracked.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 last:pb-0">
                  <KeyRound size={16} className="shrink-0 text-slate-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Two-Factor Auth</p>
                    <p className="mt-1 text-xs font-medium text-slate-200">
                      {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  {!user.twoFactorEnabled ? (
                    <Link
                      href="/settings"
                      className="shrink-0 text-xs font-medium text-cyan-400 transition-all hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    >
                      Enable 2FA
                    </Link>
                  ) : null}
                </div>
              </div>
            </Card>
          </div>
        }
        connected={
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Connected Accounts</h2>
                <p className="mt-1 text-xs text-slate-400">Trading workspaces available to this identity.</p>
              </div>
              <StatusPill>{user.memberships.length} linked</StatusPill>
            </div>
            {user.memberships.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#070d19]/70 p-4 transition-all hover:border-white/[0.10] hover:bg-white/[0.02]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Wallet size={17} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-100">
                          {membership.tradingAccount.name}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                            {membership.tradingAccount.type}
                          </span>
                          <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {membership.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/accounts/${membership.tradingAccount.id}/dashboard`}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-cyan-400 transition-all hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    >
                      Open workspace
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState title="No linked accounts" description="Account access will appear here after you create or join a trading account." />
              </div>
            )}
          </Card>
        }
      />
    </div>
  );
}
