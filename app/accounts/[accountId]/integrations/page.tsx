import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  Cable,
  ChevronDown,
  DatabaseZap,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  Save,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";

import GlobalToast from "@/components/GlobalToast";
import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatDateTimeByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import {
  resetAccountSyncStatus,
  updateAccountIntegrations,
} from "./actions";

type IntegrationMode = "manual" | "mt5" | "broker" | "hybrid";
type StatusTone = "neutral" | "info" | "positive" | "warning" | "negative";

type ConnectionChannel = {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
  configured: boolean;
  state: string;
  tone: StatusTone;
};

const modeLabels: Record<IntegrationMode, string> = {
  manual: "Manual only",
  mt5: "MT5 connector",
  broker: "Broker integration",
  hybrid: "MT5 + Broker",
};

const syncLogTypes = [
  "TRADE_IMPORTED",
  "TRADE_SYNC_UPDATED",
  "TRADE_SYNC_ERROR",
  "INTEGRATION_SETTINGS_UPDATED",
  "INTEGRATION_SYNC_RESET",
];

function normalizeMode(value?: string | null): IntegrationMode {
  if (
    value === "mt5" ||
    value === "broker" ||
    value === "hybrid" ||
    value === "manual"
  ) {
    return value;
  }

  return "manual";
}

function getAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function formatDate(
  value: Date | null | undefined,
  language: AppLanguage
) {
  if (!value) return "Never";
  return formatDateTimeByLanguage(value, language);
}

function getSyncState(account: {
  integrationMode: string | null;
  syncStatus: string | null;
  lastSyncedAt: Date | null;
}) {
  const mode = normalizeMode(account.integrationMode);

  if (mode === "manual") {
    return {
      label: "Manual entry",
      description: "No automatic connection is active for this account.",
      tone: "neutral" as StatusTone,
    };
  }

  if (account.syncStatus === "error") {
    return {
      label: "Needs review",
      description: "The last sync attempt reported an error.",
      tone: "negative" as StatusTone,
    };
  }

  if (account.syncStatus === "connected" && account.lastSyncedAt) {
    return {
      label: "Import recorded",
      description: "A previous automatic sync has been recorded.",
      tone: "positive" as StatusTone,
    };
  }

  return {
    label: "Prepared, not live",
    description:
      "Configuration exists, but VOLTIS is not claiming a live external connection.",
    tone: "info" as StatusTone,
  };
}

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: StatusTone;
}) {
  const tones = {
    neutral: "border-flash/[0.12] bg-surface-2 text-muted",
    info: "border-accent-bright/25 bg-accent-bright/[0.08] text-accent-bright",
    positive: "border-positive/25 bg-positive/[0.08] text-positive",
    warning: "border-warning/25 bg-warning/[0.08] text-warning",
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
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="reveal-rise p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-micro uppercase tracking-label text-muted-faint">
            {label}
          </p>
          <p className="mt-3 text-metric tabular-nums text-flash">{value}</p>
          <p className="mt-2 text-caption text-muted">{detail}</p>
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
      <p className="mt-2 text-caption text-muted">{description}</p>
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
      />
    </label>
  );
}

function ChannelCard({ channel }: { channel: ConnectionChannel }) {
  const Icon = channel.icon;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-micro uppercase tracking-label text-muted-faint">
              {channel.eyebrow}
            </p>
            <h3 className="mt-1 text-subsection text-flash">
              {channel.title}
            </h3>
            <p className="mt-2 text-caption leading-5 text-muted">
              {channel.description}
            </p>
          </div>
        </div>
        <StatusPill tone={channel.tone}>{channel.state}</StatusPill>
      </div>
    </Card>
  );
}

export default async function IntegrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ toast?: string }>;
}) {
  const { accountId } = await params;
  const query = await searchParams;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
    },
  });

  const language = normalizeAppLanguage(currentUser?.appLanguage);

  const membership = await prisma.accountMember.findFirst({
    where: {
      userId: session.user.id,
      tradingAccountId: accountId,
    },
    include: {
      tradingAccount: true,
    },
  });

  if (!membership) {
    redirect("/accounts");
  }

  const isManager = membership.role === "MANAGER";
  const canManageIntegrations = isManager || membership.canManageAccount;

  if (!canManageIntegrations) {
    redirect(`/accounts/${accountId}`);
  }

  if (membership.tradingAccount.status === "ARCHIVED") {
    redirect(`/accounts/${accountId}`);
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const account = membership.tradingAccount;
  const mode = normalizeMode(account.integrationMode);
  const syncState = getSyncState(account);
  const appBaseUrl = getAppBaseUrl();
  const healthEndpoint = `${appBaseUrl}/api/trade-sync/health`;
  const importEndpoint = `${appBaseUrl}/api/trade-sync/import`;
  const updateIntegrationsAction = updateAccountIntegrations.bind(null, accountId);
  const resetSyncStatusAction = resetAccountSyncStatus.bind(null, accountId);

  const recentSyncLogs = await prisma.activityLog.findMany({
    where: {
      accountId,
      type: {
        in: syncLogTypes,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const latestSyncError = recentSyncLogs.find(
    (log) => log.type === "TRADE_SYNC_ERROR"
  );
  const mt5Configured = Boolean(account.mt5AccountLogin && account.mt5ServerName);
  const brokerConfigured = Boolean(
    account.brokerProvider && account.brokerAccountId
  );
  const enabledSources = [
    account.mt5Enabled ? "MT5" : null,
    account.brokerSyncEnabled ? "Broker" : null,
  ].filter(Boolean);
  const needsMt5 = mode === "mt5" || mode === "hybrid";
  const needsBroker = mode === "broker" || mode === "hybrid";
  const modeConfigured =
    mode === "manual" ||
    ((!needsMt5 || mt5Configured) && (!needsBroker || brokerConfigured));
  const channels: ConnectionChannel[] = [
    {
      title: "Manual entry",
      eyebrow: "Primary safe path",
      description: "Diary entry remains available without external systems.",
      icon: DatabaseZap,
      enabled: mode === "manual",
      configured: true,
      state: mode === "manual" ? "Active" : "Available",
      tone: mode === "manual" ? "info" : "neutral",
    },
    {
      title: "MT5 connector",
      eyebrow: "Prepared channel",
      description:
        "Stores only login and server identifiers. No MT5 password is stored.",
      icon: Cable,
      enabled: account.mt5Enabled,
      configured: mt5Configured,
      state: account.mt5Enabled
        ? mt5Configured
          ? "Prepared"
          : "Missing IDs"
        : "Off",
      tone: account.mt5Enabled
        ? mt5Configured
          ? "info"
          : "warning"
        : "neutral",
    },
    {
      title: "Broker integration",
      eyebrow: "Coming later",
      description:
        "Only provider and account identifier can be stored at this stage.",
      icon: UploadCloud,
      enabled: account.brokerSyncEnabled,
      configured: brokerConfigured,
      state: account.brokerSyncEnabled
        ? brokerConfigured
          ? "Prepared"
          : "Missing IDs"
        : "Off",
      tone: account.brokerSyncEnabled
        ? brokerConfigured
          ? "info"
          : "warning"
        : "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <GlobalToast status={query.toast} language={language} />

      <div className="flex flex-col gap-4 lg:pr-[18rem] xl:pr-[20rem] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Secure connection control
          </p>
          <h1 className="mt-3 text-hero text-flash">Integrations</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Connect external platforms and automate your trading workflow.
          </p>
        </div>

      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="info">{modeLabels[mode]}</StatusPill>
              <StatusPill tone={syncState.tone}>{syncState.label}</StatusPill>
              <StatusPill tone={modeConfigured ? "info" : "warning"}>
                {modeConfigured ? "Configuration complete" : "Configuration needed"}
              </StatusPill>
            </div>

            <h2 className="mt-6 max-w-3xl text-section text-flash">
              Connection state is explicit, not implied.
            </h2>
            <p className="mt-4 max-w-3xl text-body text-muted">
              {syncState.description} External channels are preparation layers
              until a real import path records activity.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Enabled sources
              </p>
              <p className="mt-2 text-body text-flash">
                {enabledSources.length > 0 ? enabledSources.join(" + ") : "None"}
              </p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Last sync
              </p>
              <p className="mt-2 text-body text-flash">
                {formatDate(account.lastSyncedAt, language)}
              </p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4 sm:col-span-2">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Security boundary
              </p>
              <p className="mt-2 text-body text-flash">
                No raw credentials stored in this form
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Mode"
          value={modeLabels[mode]}
          detail="Controls which source fields are relevant."
          icon={SlidersHorizontal}
        />
        <StatCard
          label="Sync status"
          value={syncState.label}
          detail="Derived from saved account sync state."
          icon={RefreshCw}
        />
        <StatCard
          label="MT5 identifiers"
          value={mt5Configured ? "Present" : "Not stored"}
          detail="Login and server only, never password."
          icon={Cable}
        />
        <StatCard
          label="Broker identifiers"
          value={brokerConfigured ? "Present" : "Not stored"}
          detail="Provider and account ID only."
          icon={UploadCloud}
        />
      </section>

      {latestSyncError && (
        <Card className="border-negative/25 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <SignatureEdge orientation="vertical" className="h-4" />
                <p className="text-micro uppercase tracking-label text-negative">
                  Sync needs review
                </p>
              </div>
              <h2 className="mt-2 text-section text-flash">
                Last import attempt failed
              </h2>
              <p className="mt-2 max-w-3xl text-caption leading-5 text-muted">
                {latestSyncError.description ||
                  "The latest automatic sync event reported an error."}
              </p>
            </div>
            <form action={resetSyncStatusAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-negative/30 bg-negative/[0.08] px-4 py-3 text-sm font-medium text-negative transition-all duration-fast hover:-translate-y-0.5 hover:border-negative/55"
              >
                <RefreshCw size={16} />
                Reset status
              </button>
            </form>
          </div>
        </Card>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeader eyebrow="Configuration" title="Connection mode">
            <StatusPill tone="info">Non-sensitive only</StatusPill>
          </SectionHeader>

          <form action={updateIntegrationsAction} className="mt-6 space-y-6">
            <label className="block">
              <span className="text-micro uppercase tracking-label text-muted-faint">
                Integration mode
              </span>
              <select
                name="integrationMode"
                defaultValue={mode}
                className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
              >
                <option value="manual">{modeLabels.manual}</option>
                <option value="mt5">{modeLabels.mt5}</option>
                <option value="broker">{modeLabels.broker}</option>
                <option value="hybrid">{modeLabels.hybrid}</option>
              </select>
            </label>

            {needsMt5 && (
              <div className="space-y-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
                <div className="flex items-start gap-3">
                  <Cable size={18} className="mt-0.5 text-muted" />
                  <div>
                    <p className="text-body font-medium text-flash">
                      MT5 identifiers
                    </p>
                    <p className="mt-1 text-caption text-muted">
                      Store login and server names only. Do not enter passwords,
                      tokens, investor passwords, or VPS secrets.
                    </p>
                  </div>
                </div>
                <TextField
                  name="mt5AccountLogin"
                  label="MT5 account login"
                  defaultValue={account.mt5AccountLogin || ""}
                  placeholder="Example: 12345678"
                />
                <TextField
                  name="mt5ServerName"
                  label="MT5 server name"
                  defaultValue={account.mt5ServerName || ""}
                  placeholder="Example: Broker-Live"
                />
              </div>
            )}

            {needsBroker && (
              <div className="space-y-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
                <div className="flex items-start gap-3">
                  <UploadCloud size={18} className="mt-0.5 text-muted" />
                  <div>
                    <p className="text-body font-medium text-flash">
                      Broker identifiers
                    </p>
                    <p className="mt-1 text-caption text-muted">
                      Broker API credentials are not supported in this form.
                      Save only provider and account identifiers.
                    </p>
                  </div>
                </div>
                <TextField
                  name="brokerProvider"
                  label="Broker provider"
                  defaultValue={account.brokerProvider || ""}
                  placeholder="Example: Broker name"
                />
                <TextField
                  name="brokerAccountId"
                  label="Broker account ID"
                  defaultValue={account.brokerAccountId || ""}
                  placeholder="External account identifier"
                />
              </div>
            )}

            {mode === "manual" && (
              <EmptyState
                title="Manual mode selected"
                description="No external source fields are needed. Trades remain managed through the Diary."
              />
            )}

            <input
              type="hidden"
              name="syncStatus"
              value={account.syncStatus || "inactive"}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-caption leading-5 text-muted">
                Saving this form updates setup metadata only. It does not store
                raw credentials and does not prove a live broker connection.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
              >
                <Save size={17} />
                Save setup
              </button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <SectionHeader eyebrow="Channels" title="Connection readiness" />
          {channels.map((channel) => (
            <ChannelCard key={channel.title} channel={channel} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionHeader eyebrow="Logs" title="Recent sync activity">
            <StatusPill>{recentSyncLogs.length} loaded</StatusPill>
          </SectionHeader>
          <div className="mt-6 space-y-3">
            {recentSyncLogs.length > 0 ? (
              recentSyncLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill
                      tone={log.type === "TRADE_SYNC_ERROR" ? "negative" : "info"}
                    >
                      {log.type}
                    </StatusPill>
                    <span className="text-caption text-muted">
                      {formatDate(log.createdAt, language)}
                    </span>
                  </div>
                  <p className="mt-3 text-body font-medium text-flash">
                    {log.title}
                  </p>
                  {log.description && (
                    <p className="mt-2 text-caption leading-5 text-muted">
                      {log.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <EmptyState
                title="No sync events yet"
                description="This is expected for manual accounts or channels that have not imported trades."
              />
            )}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Security" title="Credential boundary">
            <StatusPill tone="info">Server-side</StatusPill>
          </SectionHeader>
          <div className="mt-6 space-y-3">
            {[
              "No MT5 password fields are rendered.",
              "No broker API key or token fields are rendered.",
              "The shared sync secret belongs in server environment configuration.",
              "Mutation actions re-check account membership and management permissions.",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
              >
                <LockKeyhole size={17} className="mt-0.5 shrink-0 text-muted" />
                <p className="text-caption leading-5 text-muted">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <details className="group rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1 p-5">
        <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
              <Server size={18} />
            </div>
            <div>
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Technical reference
              </p>
              <h2 className="mt-1 text-subsection text-flash">
                Connector endpoints and account identifiers
              </h2>
            </div>
          </div>
          <ChevronDown
            size={18}
            className="text-muted transition-transform duration-base group-open:rotate-180"
          />
        </summary>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[
            ["Trading Account ID", account.id],
            ["Sync secret", "Stored only in server environment"],
            ["Health endpoint", healthEndpoint],
            ["Import endpoint", importEndpoint],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
            >
              <p className="text-micro uppercase tracking-label text-muted-faint">
                {label}
              </p>
              <p className="mt-3 break-all font-mono text-caption text-flash">
                {value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-caption leading-5 text-muted">
          Future connectors should check health first, then submit closed trades
          to the import endpoint only when the server reports that the account is
          ready. Imported trades enter Diary as synced records and may require
          review.
        </p>
      </details>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-body font-medium text-flash">
                Integration settings are permission-gated.
              </p>
              <p className="mt-1 text-caption text-muted">
                This page is visible only to managers or account-control roles,
                and the server action validates the same boundary.
              </p>
            </div>
          </div>
          <StatusPill tone="info">
            <KeyRound size={13} className="mr-2" />
            Protected
          </StatusPill>
        </div>
      </Card>
    </div>
  );
}
