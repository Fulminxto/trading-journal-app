import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock3,
  IdCard,
  KeyRound,
  LineChart,
  Save,
  ShieldCheck,
  Target,
  TrendingUp,
  Upload,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import GlobalToast from "@/components/GlobalToast";
import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import {
  formatCurrencyByLanguage,
  formatDateByLanguage,
  formatDateTimeByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "./ChangePasswordForm";
import { updateProfile } from "./actions";

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

function valueTone(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";
  return "text-muted";
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
      createdTrades: {
        orderBy: {
          openDate: "desc",
        },
        take: 10,
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

  const profileCompletionItems = [
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
  const completedProfileItems =
    profileCompletionItems.filter(Boolean).length;
  const profileCompletion = Math.round(
    (completedProfileItems / profileCompletionItems.length) * 100
  );

  const formatCurrency = (value: number) =>
    formatCurrencyByLanguage(value, currency, appLanguage);
  const formatDateTime = (date?: Date | null) =>
    date ? formatDateTimeByLanguage(date, appLanguage) : "Never";
  const formatShortDate = (date: Date) =>
    formatDateByLanguage(date, appLanguage);
  const securityRows: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
  }> = [
    { label: "Authentication", value: "Protected", icon: ShieldCheck },
    { label: "System role", value: user.role, icon: IdCard },
    {
      label: "Two-factor",
      value: user.twoFactorEnabled ? "Enabled" : "Not enabled",
      icon: KeyRound,
    },
    { label: "Email", value: user.email ? user.email : "Not set", icon: BadgeCheck },
    {
      label: "Last activity",
      value: formatDateTime(user.lastActivityAt),
      icon: Clock3,
    },
    { label: "Login count", value: String(user.loginCount), icon: Briefcase },
  ];

  return (
    <div className="space-y-8">
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
                <StatusPill tone="info">{profileCompletion}% complete</StatusPill>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Last login
              </p>
              <p className="mt-2 text-caption leading-5 text-flash">
                {formatDateTime(user.lastLoginAt)}
              </p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Last activity
              </p>
              <p className="mt-2 text-caption leading-5 text-flash">
                {formatDateTime(user.lastActivityAt)}
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

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <SectionHeader eyebrow="Identity" title="Personal profile">
            <StatusPill tone="info">Private</StatusPill>
          </SectionHeader>

          <form action={updateProfile} className="mt-6 space-y-8">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-1 p-3 text-muted">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-body font-medium text-flash">
                    Profile image
                  </p>
                  <p className="mt-2 text-caption leading-5 text-muted">
                    JPG, PNG, or WEBP. Maximum size: 5MB. The server validates
                    file type, size, and image signature before upload.
                  </p>
                </div>
              </div>
              <input
                type="file"
                name="profileImage"
                accept="image/jpeg,image/png,image/webp"
                className="mt-4 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-1 px-4 py-3 text-sm text-muted outline-none file:mr-4 file:rounded-inner file:border-0 file:bg-accent-bright/[0.12] file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent-bright hover:file:bg-accent-bright/[0.18]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                name="name"
                label="Display name"
                defaultValue={user.name}
                placeholder="Display name"
              />
              <TextField
                name="username"
                label="Username"
                defaultValue={user.username}
                placeholder="Username"
                required
              />
              <TextField
                name="workspaceName"
                label="Workspace name"
                defaultValue={user.workspaceName}
                placeholder="Workspace name"
              />
              <TextField
                name="timezone"
                label="Timezone"
                defaultValue={user.timezone}
                placeholder="Europe/Rome"
              />
              <TextAreaField
                name="bio"
                label="Bio"
                defaultValue={user.bio}
                placeholder="Briefly describe your trader profile."
              />
            </div>

            <div>
              <SectionHeader
                eyebrow="Operating preferences"
                title="Trading identity"
              />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <SelectField
                  name="tradingStyle"
                  label="Trading style"
                  defaultValue={user.tradingStyle}
                  placeholder="Select style"
                  options={[
                    "Scalping",
                    "Day Trading",
                    "Swing Trading",
                    "Position Trading",
                  ]}
                />
                <SelectField
                  name="favoriteMarket"
                  label="Favorite market"
                  defaultValue={user.favoriteMarket}
                  placeholder="Select market"
                  options={[
                    "Forex",
                    "Gold",
                    "Crypto",
                    "Indices",
                    "Commodities",
                  ]}
                />
                <SelectField
                  name="preferredSession"
                  label="Preferred session"
                  defaultValue={user.preferredSession}
                  placeholder="Select session"
                  options={["Asia", "London", "New York", "Overlap"]}
                />
                <TextField
                  name="riskPerTrade"
                  label="Risk per trade %"
                  type="number"
                  step="0.01"
                  defaultValue={user.riskPerTrade}
                  placeholder="1"
                />
                <TextField
                  name="preferredBroker"
                  label="Preferred broker"
                  defaultValue={user.preferredBroker}
                  placeholder="Broker / Prop Firm"
                />
                <TextField
                  name="setupStyle"
                  label="Setup style"
                  defaultValue={user.setupStyle}
                  placeholder="Breakout, Pullback, SMC"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-caption leading-5 text-muted">
                Profile data personalizes the app experience. Security-sensitive
                changes remain server-side.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
              >
                <Save size={17} />
                Save profile
              </button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionHeader eyebrow="Completion" title="Identity readiness">
              <StatusPill tone="info">{profileCompletion}%</StatusPill>
            </SectionHeader>
            <div className="mt-6 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-caption text-muted">Completed fields</p>
                <p className="text-caption text-flash">
                  {completedProfileItems}/{profileCompletionItems.length}
                </p>
              </div>
              <div className="mt-4 h-2 rounded-pill bg-surface-1">
                <div
                  className="h-2 rounded-pill bg-accent-bright"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="mt-4 text-caption leading-5 text-muted">
                This is a setup completeness indicator, not a quality score.
              </p>
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Workspace" title="Account access">
              <StatusPill>{user.memberships.length} linked</StatusPill>
            </SectionHeader>
            <div className="mt-6 space-y-3">
              {user.memberships.length > 0 ? (
                user.memberships.map((membership) => (
                  <Link
                    key={membership.id}
                    href={`/accounts/${membership.tradingAccount.id}`}
                    className="block rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4 transition-all duration-base hover:-translate-y-0.5 hover:border-accent-bright/40"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-body font-medium text-flash">
                          {membership.tradingAccount.name}
                        </p>
                        <p className="mt-1 text-caption text-muted">
                          {membership.tradingAccount.type} / {membership.role}
                        </p>
                      </div>
                      <ArrowRight size={16} className="shrink-0 text-muted" />
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState
                  title="No linked accounts"
                  description="Account access will appear here after you create or join a trading account."
                />
              )}
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Activity" title="Recent trades">
              <StatusPill>{user.createdTrades.length} loaded</StatusPill>
            </SectionHeader>
            <div className="mt-6 space-y-3">
              {user.createdTrades.length > 0 ? (
                user.createdTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-body font-medium text-flash">
                          {trade.symbol}
                        </p>
                        <p className="mt-1 text-caption text-muted">
                          {formatShortDate(trade.openDate)}
                        </p>
                      </div>
                      <span
                        className={`rounded-pill border-[0.5px] border-flash/[0.08] bg-surface-1 px-3 py-1 text-caption font-medium ${valueTone(
                          trade.resultUsd || 0
                        )}`}
                      >
                        {formatCurrency(trade.resultUsd || 0)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No recent trades"
                  description="Recent trades created by this identity will appear here when they exist."
                />
              )}
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Security" title="Change password">
              <StatusPill tone="info">Protected</StatusPill>
            </SectionHeader>
            <div className="mt-6">
              <ChangePasswordForm appLanguage={appLanguage} />
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Access" title="Security status">
              <StatusPill>{user.status}</StatusPill>
            </SectionHeader>
            <div className="mt-6 grid gap-3">
              {securityRows.map(({ label, value, icon: RowIcon }) => {
                return (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
                  >
                    <RowIcon size={17} className="shrink-0 text-muted" />
                    <div className="min-w-0">
                      <p className="text-micro uppercase tracking-label text-muted-faint">
                        {label}
                      </p>
                      <p className="mt-1 break-words text-caption text-flash">
                        {value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
