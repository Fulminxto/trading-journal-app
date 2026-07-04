import type { ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BrainCircuit,
  Crown,
  FileText,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  SquarePen,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PermissionItem = {
  label: string;
  enabled: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "No activity recorded";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function getRoleLabel(role: string, isOwner = false) {
  if (isOwner) return "Owner";
  if (role === "MANAGER") return "Admin";
  if (role === "VIEWER") return "Viewer";
  return "Member";
}

function getRoleDescription(role: string, isOwner = false) {
  if (isOwner) return "Protected creator identity with account-level authority.";
  if (role === "MANAGER") return "Administrative access with management authority when permissions allow it.";
  if (role === "VIEWER") return "Observation-first access. Execution capabilities are intentionally narrow.";
  return "Execution contributor with permissions set explicitly by the account admins.";
}

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "positive" | "warning";
}) {
  const tones = {
    neutral: "border-flash/[0.12] bg-surface-2 text-muted",
    info: "border-accent-bright/25 bg-accent-bright/[0.08] text-accent-bright",
    positive: "border-positive/25 bg-positive/[0.08] text-positive",
    warning: "border-warning/25 bg-warning/[0.08] text-warning",
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

function PermissionRow({ permission }: { permission: PermissionItem }) {
  const Icon = permission.icon;

  return (
    <div className="flex flex-col gap-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-1 p-3 text-muted">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-body font-medium text-flash">{permission.label}</p>
          <p className="mt-1 text-caption text-muted">{permission.description}</p>
        </div>
      </div>
      <StatusPill tone={permission.enabled ? "positive" : "neutral"}>
        {permission.enabled ? "Allowed" : "Off"}
      </StatusPill>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </p>
      <p className="mt-3 text-metric text-flash">{value}</p>
      <p className="mt-2 text-caption text-muted">{detail}</p>
    </Card>
  );
}

export default async function MemberAccessPage({
  params,
}: {
  params: Promise<{
    accountId: string;
    memberId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId, memberId } = await params;

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

  if (membership.tradingAccount.status === "ARCHIVED") {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (membership.role !== "MANAGER" && !membership.canViewMembers) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const targetMembership = await prisma.accountMember.findFirst({
    where: {
      userId: memberId,
      tradingAccountId: accountId,
    },
    include: {
      user: true,
    },
  });

  if (!targetMembership) {
    redirect(`/accounts/${accountId}/members`);
  }

  const isOwner = targetMembership.userId === membership.tradingAccount.createdById;
  const displayName =
    targetMembership.user.name ?? targetMembership.user.username;
  const operationalPermissions: PermissionItem[] = [
    {
      label: "Create trades",
      enabled: targetMembership.canCreateTrades,
      icon: SquarePen,
      description: "Allows this member to add new account trade records.",
    },
    {
      label: "Edit trades",
      enabled: targetMembership.canEditTrades,
      icon: FileText,
      description: "Allows corrections to existing trade records.",
    },
    {
      label: "Delete trades",
      enabled: targetMembership.canDeleteTrades,
      icon: Trash2,
      description: "Allows destructive trade removal through protected actions.",
    },
  ];
  const roomPermissions: PermissionItem[] = [
    {
      label: "Analytics",
      enabled: targetMembership.canViewAnalytics,
      icon: BrainCircuit,
      description: "Grants access to analytical review rooms for this account.",
    },
    {
      label: "Reports",
      enabled: targetMembership.canViewReports,
      icon: FileText,
      description: "Grants access to executive report surfaces.",
    },
    {
      label: "Copilot",
      enabled: targetMembership.canViewCopilot,
      icon: BadgeCheck,
      description: "Grants access to account-scoped rule-based intelligence.",
    },
    {
      label: "Members",
      enabled: targetMembership.canViewMembers,
      icon: Users,
      description: "Allows this member to view the account access roster.",
    },
  ];
  const controlPermissions: PermissionItem[] = [
    {
      label: "Manage members",
      enabled: targetMembership.canManageMembers,
      icon: UserCog,
      description: "Allows invitations and member removal when server checks pass.",
    },
    {
      label: "Manage roles",
      enabled: targetMembership.canManageRoles,
      icon: KeyRound,
      description: "Allows role and permission changes when server checks pass.",
    },
    {
      label: "Manage account",
      enabled: targetMembership.canManageAccount,
      icon: ShieldCheck,
      description: "Reserved account-management authority.",
    },
  ];
  const allPermissions = [
    ...operationalPermissions,
    ...roomPermissions,
    ...controlPermissions,
  ];
  const allowedCount = allPermissions.filter((permission) => permission.enabled).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Access dossier
          </p>
          <h1 className="mt-3 text-hero text-flash">{displayName}</h1>
          <div className="mt-4 max-w-3xl">
            <SignatureEdge orientation="horizontal" className="mb-4 max-w-40" />
            <p className="text-body text-muted">
              This page describes access, not performance. It reflects the
              account membership record used by server-side permission checks.
            </p>
          </div>
        </div>

        <Link
          href={`/accounts/${accountId}/members`}
          className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright"
        >
          <ArrowLeft size={16} />
          Back to members
        </Link>
      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={isOwner ? "info" : "neutral"}>
                {getRoleLabel(targetMembership.role, isOwner)}
              </StatusPill>
              {targetMembership.userId === session.user.id && (
                <StatusPill tone="info">You</StatusPill>
              )}
              {isOwner && <StatusPill tone="warning">Protected identity</StatusPill>}
            </div>

            <h2 className="mt-6 max-w-3xl text-section text-flash">
              {getRoleDescription(targetMembership.role, isOwner)}
            </h2>
            <p className="mt-4 max-w-3xl text-body text-muted">
              Changes to this member should be made from the Members control
              room. The underlying actions keep membership and role validation
              server-side.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Username
              </p>
              <p className="mt-2 text-body text-flash">
                @{targetMembership.user.username}
              </p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Joined
              </p>
              <p className="mt-2 text-body text-flash">
                {formatDate(targetMembership.createdAt)}
              </p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Last seen
              </p>
              <p className="mt-2 text-body text-flash">
                {formatDate(
                  targetMembership.user.lastActivityAt ??
                    targetMembership.user.lastSeenAt
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Allowed permissions"
          value={`${allowedCount}/${allPermissions.length}`}
          detail="Total access switches currently enabled."
        />
        <SummaryCard
          label="Execution"
          value={`${operationalPermissions.filter((permission) => permission.enabled).length}/3`}
          detail="Trade creation, editing, and deletion authority."
        />
        <SummaryCard
          label="Control"
          value={`${controlPermissions.filter((permission) => permission.enabled).length}/3`}
          detail="Member, role, and account management authority."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionHeader eyebrow="Execution" title="Trade controls" />
          <div className="mt-6 space-y-3">
            {operationalPermissions.map((permission) => (
              <PermissionRow key={permission.label} permission={permission} />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Rooms" title="Visible intelligence surfaces" />
          <div className="mt-6 space-y-3">
            {roomPermissions.map((permission) => (
              <PermissionRow key={permission.label} permission={permission} />
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <SectionHeader eyebrow="Authority" title="Management permissions">
          <StatusPill tone={controlPermissions.some((permission) => permission.enabled) ? "info" : "neutral"}>
            {controlPermissions.some((permission) => permission.enabled)
              ? "Control enabled"
              : "No management access"}
          </StatusPill>
        </SectionHeader>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {controlPermissions.map((permission) => (
            <PermissionRow key={permission.label} permission={permission} />
          ))}
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          {
            icon: Crown,
            title: "Owner",
            text: "Account creator. Protected from removal and role reduction.",
          },
          {
            icon: ShieldCheck,
            title: "Admin",
            text: "Highest operational role below owner, with explicit management switches.",
          },
          {
            icon: UserCog,
            title: "Member",
            text: "Execution participant with clear trade and room permissions.",
          },
          {
            icon: LockKeyhole,
            title: "Viewer",
            text: "Observation role for constrained, low-risk access.",
          },
        ].map((item) => (
          <Card key={item.title} className="p-5">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
              <item.icon size={18} />
            </div>
            <p className="mt-4 text-body font-medium text-flash">{item.title}</p>
            <p className="mt-2 text-caption text-muted">{item.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
