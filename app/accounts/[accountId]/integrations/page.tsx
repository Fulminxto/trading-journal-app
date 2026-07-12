import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  Cable,
  ChevronDown,
  DatabaseZap,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";

import GlobalToast from "@/components/GlobalToast";
import IntegrationSetupForm from "@/components/integrations/IntegrationSetupForm";
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
  if (!value) return "No sync yet";
  return formatDateTimeByLanguage(value, language);
}

function getActivityPresentation(type: string) {
  if (type === "INTEGRATION_SETTINGS_UPDATED") {
    return {
      title: "Integration settings updated",
      description: "Connection mode or non-sensitive identifiers were updated.",
      badge: "Settings updated",
    };
  }

  if (type === "TRADE_IMPORTED" || type === "TRADE_SYNC_UPDATED") {
    return {
      title: "Account activity imported",
      description: "External trading activity was imported successfully.",
      badge: "Import complete",
    };
  }

  if (type === "TRADE_SYNC_ERROR") {
    return {
      title: "Import failed",
      description: "The external connector could not import account activity.",
      badge: "Failed",
    };
  }

  if (type === "INTEGRATION_SYNC_RESET") {
    return {
      title: "Connection status reset",
      description: "The saved connection status was reset.",
      badge: "Status reset",
    };
  }

  return {
    title: "Connection activity updated",
    description: "A connection-related account update was recorded.",
    badge: "Updated",
  };
}

function getActivitySource(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const source = (metadata as Record<string, unknown>).source;
  return source === "mt5" || source === "broker" ? source : null;
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
  const mt5Configured = Boolean(
    account.mt5AccountLogin?.trim() && account.mt5ServerName?.trim()
  );
  const brokerConfigured = Boolean(
    account.brokerProvider?.trim() && account.brokerAccountId?.trim()
  );
  const needsMt5 = mode === "mt5" || mode === "hybrid";
  const needsBroker = mode === "broker" || mode === "hybrid";
  const configuredSources = [
    needsMt5 && mt5Configured ? "MT5" : null,
    needsBroker && brokerConfigured ? "Broker" : null,
  ].filter((source): source is string => Boolean(source));
  const configuredSourceCount = configuredSources.length;
  const latestSuccessfulImport = recentSyncLogs.find(
    (log) => log.type === "TRADE_IMPORTED" || log.type === "TRADE_SYNC_UPDATED"
  );
  const latestImportSource = getActivitySource(latestSuccessfulImport?.metadata);
  const hasSuccessfulImport = Boolean(
    account.syncStatus === "connected" && account.lastSyncedAt
  );
  const mt5ImportActive =
    hasSuccessfulImport && (mode === "mt5" || latestImportSource === "mt5");
  const brokerImportActive =
    hasSuccessfulImport && (mode === "broker" || latestImportSource === "broker");

  const heroState = (() => {
    if (mode === "manual") {
      return {
        primaryBadge: "Manual mode",
        secondaryBadge: "No external source",
        title: "Manual entry is active.",
        description:
          "Trades can be recorded normally through the Diary. Connect an external source only when automation is needed.",
      };
    }

    if (mode === "mt5") {
      return mt5Configured
        ? {
            primaryBadge: "MT5 connector",
            secondaryBadge: "Source configured",
            title: "External import is prepared.",
            description:
              "MT5 identifiers are configured. VOLTIS is ready to receive activity through the protected import path.",
          }
        : {
            primaryBadge: "MT5 mode",
            secondaryBadge: "Setup required",
            title: "MT5 mode is selected.",
            description:
              "Complete the MT5 identifiers before external imports can be prepared.",
          };
    }

    if (mode === "broker") {
      return brokerConfigured
        ? {
            primaryBadge: "Broker connector",
            secondaryBadge: "Source configured",
            title: "External import is prepared.",
            description:
              "Broker identifiers are configured. VOLTIS is ready to receive activity through the protected import path.",
          }
        : {
            primaryBadge: "Broker mode",
            secondaryBadge: "Setup required",
            title: "Broker mode is selected.",
            description:
              "Complete the broker identifiers before external imports can be prepared.",
          };
    }

    return {
      primaryBadge: "Hybrid mode",
      secondaryBadge:
        configuredSourceCount === 2
          ? "2 sources configured"
          : configuredSourceCount === 1
            ? "Partially configured"
            : "Setup required",
      title:
        configuredSourceCount === 2
          ? "External import is prepared."
          : "Hybrid mode is selected.",
      description:
        configuredSourceCount === 2
          ? "MT5 and broker identifiers are configured for the protected import path."
          : "Complete both connector identifier groups to prepare the full hybrid setup.",
    };
  })();

  const externalSyncState =
    account.syncStatus === "error"
      ? "Failed"
      : mode === "manual"
        ? "Not connected"
        : configuredSourceCount === 0
            ? "Awaiting setup"
            : mode === "hybrid" && configuredSourceCount === 1
              ? "Partially configured"
              : hasSuccessfulImport
                ? "Active"
                : "Ready for import";

  const channels: ConnectionChannel[] = [
    {
      title: "Manual entry",
      eyebrow: "Current workflow",
      description: "Trades can be entered and managed through the Trading Diary.",
      icon: DatabaseZap,
      state: mode === "manual" ? "Active" : "Available",
      tone: mode === "manual" ? "info" : "neutral",
    },
    {
      title: "MT5 connector",
      eyebrow: "External channel",
      description:
        "Stores non-sensitive login and server identifiers. Passwords are never collected.",
      icon: Cable,
      state: !needsMt5
        ? "Available"
        : !mt5Configured
          ? "Ready to configure"
          : mt5ImportActive
            ? "Import active"
            : "Identifiers saved",
      tone: !needsMt5
        ? "neutral"
        : !mt5Configured
          ? "warning"
          : mt5ImportActive
            ? "positive"
            : "info",
    },
    {
      title: "Broker integration",
      eyebrow: "External channel",
      description:
        "Stores provider and account identifiers for the protected server import path.",
      icon: UploadCloud,
      state: !needsBroker
        ? "Available"
        : !brokerConfigured
          ? "Ready to configure"
          : brokerImportActive
            ? "Import active"
            : "Identifiers saved",
      tone: !needsBroker
        ? "neutral"
        : !brokerConfigured
          ? "warning"
          : brokerImportActive
            ? "positive"
            : "info",
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
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="info">{heroState.primaryBadge}</StatusPill>
              <StatusPill
                tone={
                  mode !== "manual" &&
                  configuredSourceCount < (mode === "hybrid" ? 2 : 1)
                    ? "warning"
                    : configuredSourceCount > 0
                      ? "info"
                      : "neutral"
                }
              >
                {heroState.secondaryBadge}
              </StatusPill>
            </div>

            <h2 className="mt-6 max-w-3xl text-section text-flash">
              {heroState.title}
            </h2>
            <p className="mt-4 max-w-3xl text-body text-muted">
              {heroState.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                External sources
              </p>
              <p className="mt-2 text-body text-flash">
                {configuredSourceCount === 0 && mode !== "manual"
                  ? "0 configured"
                  : `${configuredSourceCount} ${configuredSourceCount === 1 ? "source" : "sources"}`}
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
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Data mode"
          value={
            mode === "manual"
              ? "Manual"
              : mode === "hybrid"
                ? "Hybrid"
                : modeLabels[mode]
          }
          detail="The active account entry workflow."
          icon={SlidersHorizontal}
        />
        <StatCard
          label="External sync"
          value={externalSyncState}
          detail="Based on enabled sources and recorded sync state."
          icon={RefreshCw}
        />
        <StatCard
          label="MT5 setup"
          value={
            mt5ImportActive
              ? "Active"
              : mt5Configured
                ? "Identifiers saved"
                : "Not configured"
          }
          detail="Login and server only, never password."
          icon={Cable}
        />
        <StatCard
          label="Broker setup"
          value={
            brokerImportActive
              ? "Active"
              : brokerConfigured
                ? "Identifiers saved"
                : "Not configured"
          }
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

          <IntegrationSetupForm
            action={updateIntegrationsAction}
            initialMode={mode}
            initialValues={{
              mt5AccountLogin: account.mt5AccountLogin || "",
              mt5ServerName: account.mt5ServerName || "",
              brokerProvider: account.brokerProvider || "",
              brokerAccountId: account.brokerAccountId || "",
            }}
          />
        </Card>

        <div className="space-y-4">
          <SectionHeader eyebrow="Channels" title="Connection readiness" />
          {channels.map((channel) => (
            <ChannelCard key={channel.title} channel={channel} />
          ))}
        </div>
      </section>

      <section>
        <Card>
          <SectionHeader eyebrow="Security" title="Credential protection">
            <StatusPill tone="info">Protected</StatusPill>
          </SectionHeader>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              [
                "Passwords stay outside VOLTIS",
                "MT5 passwords are never entered or stored in this setup.",
              ],
              [
                "Broker secrets remain protected",
                "API keys and access tokens are not collected here.",
              ],
              [
                "Connection secrets stay server-side",
                "Shared connection credentials remain outside the account interface.",
              ],
              [
                "Changes are permission-protected",
                "Only authorized members can update connection settings.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="flex gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
              >
                <LockKeyhole
                  size={17}
                  className="mt-0.5 shrink-0 text-muted"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-body font-medium text-flash">{title}</p>
                  <p className="mt-1 text-caption leading-5 text-muted">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <SectionHeader eyebrow="Logs" title="Connection activity">
            <StatusPill>{recentSyncLogs.length} events</StatusPill>
          </SectionHeader>
          <div className="mt-6 space-y-3">
            {recentSyncLogs.length > 0 ? (
              recentSyncLogs.map((log) => {
                const presentation = getActivityPresentation(log.type);
                const actor = log.user?.name ?? log.user?.username ?? "System";

                return (
                  <div
                    key={log.id}
                    className="flex flex-col gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-body font-medium text-flash">
                        {presentation.title}
                      </p>
                      <p className="mt-1 text-caption leading-5 text-muted">
                        {presentation.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <StatusPill
                        tone={log.type === "TRADE_SYNC_ERROR" ? "negative" : "info"}
                      >
                        {presentation.badge}
                      </StatusPill>
                      <span className="text-caption text-muted">
                        {actor} &middot; {formatDate(log.createdAt, language)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="No connection activity yet"
                description="Configuration changes and connector imports will appear here."
              />
            )}
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
                Connector reference
              </h2>
              <p className="mt-1 text-caption text-muted">
                Endpoints and non-sensitive account identifiers.
              </p>
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
                Account-protected integrations
              </p>
              <p className="mt-1 text-caption text-muted">
                Only authorized members can update connection settings.
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
