import type { ReactNode } from "react";
import {
  Crown,
  DoorOpen,
  Eye,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InviteMemberForm, CancelInviteButton } from "./invite-form";
import { MemberManagementActions } from "./member-actions";

type PermissionKey =
  | "canCreateTrades"
  | "canEditTrades"
  | "canDeleteTrades"
  | "canViewAnalytics"
  | "canViewReports"
  | "canViewCopilot"
  | "canViewMembers";

const permissionLabels: Record<PermissionKey, string> = {
  canCreateTrades: "Create trades",
  canEditTrades: "Edit trades",
  canDeleteTrades: "Delete trades",
  canViewAnalytics: "Analytics",
  canViewReports: "Reports",
  canViewCopilot: "Copilot",
  canViewMembers: "View members",
};

const editablePermissionKeys = Object.keys(permissionLabels) as PermissionKey[];

const formLabels = {
  usernamePlaceholder: "Username",
  sendInvite: "Send invite",
  roleManager: "Admin",
  roleMember: "Member",
  roleViewer: "Viewer",
};

const managementLabels = {
  changeRoleLabel: "Role assignment",
  saveRole: "Save role",
  permissionsLabel: "Operational permissions",
  savePermissions: "Save permissions",
  removeMemberLabel: "Remove access",
  confirmRemove: "Confirm removal. This member will lose access to this account.",
  confirmYes: "Remove access",
  cancelConfirm: "Cancel",
  lastManagerNote: "Only admin on the account. This role cannot be reduced.",
  roleManager: "Admin",
  roleMember: "Member",
  roleViewer: "Viewer",
  perm_canCreateTrades: permissionLabels.canCreateTrades,
  perm_canEditTrades: permissionLabels.canEditTrades,
  perm_canDeleteTrades: permissionLabels.canDeleteTrades,
  perm_canViewAnalytics: permissionLabels.canViewAnalytics,
  perm_canViewReports: permissionLabels.canViewReports,
  perm_canViewCopilot: permissionLabels.canViewCopilot,
  perm_canViewMembers: permissionLabels.canViewMembers,
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "No activity yet";

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

function getRoleDescription(
  role: string,
  isOwner = false,
  canManageMembers = false,
  canManageRoles = false
) {
  if (isOwner) return "Account creator with protected control.";
  if (role === "MANAGER") {
    return canManageMembers || canManageRoles
      ? "Admin hierarchy with explicitly granted management access."
      : "Admin hierarchy with operational access and read-only management.";
  }
  if (role === "VIEWER") return "Read-first access with limited execution rights.";
  return "Operational contributor with configured permissions.";
}

function getManagementAccess(canManageMembers: boolean, canManageRoles: boolean) {
  if (canManageMembers && canManageRoles) return "Available";
  if (canManageMembers || canManageRoles) return "Restricted";
  return "Read only";
}

function getRoleRank(role: string, isOwner = false) {
  if (isOwner) return 0;
  if (role === "MANAGER") return 1;
  if (role === "MEMBER") return 2;
  return 3;
}

function getRoleTone(role: string, isOwner = false) {
  if (isOwner) {
    return "border-accent-bright/35 bg-accent-bright/[0.08] text-accent-bright";
  }

  if (role === "MANAGER") {
    return "border-accent/35 bg-accent/[0.08] text-flash";
  }

  if (role === "MEMBER") {
    return "border-halo/25 bg-halo/[0.06] text-muted";
  }

  return "border-flash/[0.12] bg-surface-2 text-muted";
}

function getAccessSummary(member: Record<PermissionKey, boolean>) {
  const trading = [
    member.canCreateTrades,
    member.canEditTrades,
    member.canDeleteTrades,
  ].filter(Boolean).length;
  const intelligence = [
    member.canViewAnalytics,
    member.canViewReports,
    member.canViewCopilot,
  ].filter(Boolean).length;

  return [
    `${trading}/3 trade controls`,
    `${intelligence}/3 intelligence rooms`,
    member.canViewMembers ? "Team visible" : "Team hidden",
  ];
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
  icon: React.ComponentType<{ size?: number; className?: string }>;
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

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "warning";
}) {
  const tones = {
    neutral: "border-flash/[0.12] bg-surface-2 text-muted",
    info: "border-accent-bright/25 bg-accent-bright/[0.08] text-accent-bright",
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

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
      <p className="text-body font-medium text-flash">{title}</p>
      <p className="mt-2 text-caption text-muted">{description}</p>
    </div>
  );
}

export default async function MembersPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await prisma.accountMember.findFirst({
    where: {
      userId: session.user.id,
      tradingAccountId: accountId,
    },
    include: {
      user: true,
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

  const [members, pendingInvites] = await Promise.all([
    prisma.accountMember.findMany({
      where: { tradingAccountId: accountId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    }),
    membership.canManageMembers
      ? prisma.accountInvite.findMany({
          where: { tradingAccountId: accountId },
          include: {
            invitedUser: { select: { id: true, username: true, name: true } },
            invitedBy: { select: { id: true, username: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const accountCreatorId = membership.tradingAccount.createdById ?? "";
  const managerCount = members.filter((member) => member.role === "MANAGER").length;
  const managementAccess = getManagementAccess(
    membership.canManageMembers,
    membership.canManageRoles
  );
  const ownerCount = members.filter((member) => member.userId === accountCreatorId).length;
  const adminCount = members.filter(
    (member) => member.role === "MANAGER" && member.userId !== accountCreatorId
  ).length;
  const activePermissionCount = members.reduce(
    (sum, member) =>
      sum + editablePermissionKeys.filter((key) => member[key]).length,
    0
  );
  const maxPermissionCount = members.length * editablePermissionKeys.length;
  const sortedMembers = [...members].sort(
    (a, b) =>
      getRoleRank(a.role, a.userId === accountCreatorId) -
      getRoleRank(b.role, b.userId === accountCreatorId)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:pr-[18rem] xl:pr-[20rem] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Access control
          </p>
          <h1 className="mt-3 text-hero text-flash">Members</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Review account roles, permissions, and collaboration boundaries.
          </p>
        </div>

      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill tone="info">Control room</StatusPill>
                <StatusPill>Shared account</StatusPill>
              </div>
              <h2 className="mt-6 max-w-3xl text-section text-flash">
                Role hierarchy is the operating boundary.
              </h2>
              <p className="mt-4 max-w-3xl text-body text-muted">
                Owner and admin access sits above execution roles. Member and
                viewer access stays explicit, narrow, and auditable.
              </p>
            </div>

            <div className="w-full lg:min-w-[280px] lg:max-w-[380px] lg:justify-self-end">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Your access
              </p>
              <p className="mt-3 text-section text-flash">
                {getRoleLabel(membership.role, membership.userId === accountCreatorId)}
              </p>
              <p className="mt-2 text-body text-muted">
                {managementAccess === "Read only"
                  ? "Read-only management"
                  : `Management ${managementAccess.toLowerCase()}`}
              </p>
            </div>
          </div>

          <div className="grid gap-5 border-t border-flash/[0.1] pt-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Account owner", ownerCount > 0 ? "Assigned" : "Not assigned"],
              ["Admins", String(adminCount)],
              ["Members", String(members.length)],
              ["Pending invites", String(pendingInvites.length)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  {label}
                </p>
                <p className="mt-2 text-body font-medium text-flash">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total members"
          value={String(members.length)}
          detail="People with account membership."
          icon={Users}
        />
        <StatCard
          label="Pending invites"
          value={String(pendingInvites.length)}
          detail="Open invitations waiting for response."
          icon={UserPlus}
        />
        <StatCard
          label="Operational permissions"
          value={
            maxPermissionCount > 0
              ? `${activePermissionCount}/${maxPermissionCount}`
              : "No members"
          }
          detail={`Granted execution, intelligence and visibility capabilities across ${members.length} memberships.`}
          icon={KeyRound}
        />
        <StatCard
          label="Management access"
          value={managementAccess}
          detail="Based on explicit membership permissions."
          icon={ShieldCheck}
        />
      </section>

      {membership.canManageMembers && (
        <section id="invite-access" className="grid scroll-mt-6 gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card className="reveal-rise">
            <SectionHeader eyebrow="Provisioning" title="Invite access" />
            <p className="mt-3 text-caption text-muted">
              Invite by username and choose the initial role. Admin invitations
              remain available only to users with role-management permission.
            </p>
            <div className="mt-6">
              <InviteMemberForm
                accountId={accountId}
                canManageRoles={membership.canManageRoles}
                t={formLabels}
              />
            </div>
          </Card>

          <Card className="reveal-rise">
            <SectionHeader eyebrow="Queue" title="Pending invitations">
              <StatusPill>{pendingInvites.length} open</StatusPill>
            </SectionHeader>
            <div className="mt-6 space-y-3">
              {pendingInvites.length > 0 ? (
                pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex flex-col gap-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-body font-medium text-flash">
                        {invite.invitedUser.name ?? invite.invitedUser.username}
                      </p>
                      <p className="mt-1 text-caption text-muted">
                        Invited as {getRoleLabel(invite.role)} by{" "}
                        {invite.invitedBy.name ?? invite.invitedBy.username}
                      </p>
                    </div>
                    <CancelInviteButton
                      accountId={accountId}
                      inviteId={invite.id}
                      label="Cancel"
                    />
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No pending invitations"
                  description="The access queue is clear. New invites will appear here until accepted or cancelled."
                />
              )}
            </div>
          </Card>
        </section>
      )}

      <section className="space-y-5">
        <SectionHeader eyebrow="Hierarchy" title="Account access roster">
          {membership.canManageMembers ? (
            <Link
              href="#invite-access"
              className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/25 bg-accent-bright/[0.08] px-4 py-2.5 text-sm font-medium text-accent-bright transition-all duration-fast hover:border-accent-bright/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50"
            >
              <UserPlus size={16} />
              Invite member
            </Link>
          ) : (
            <StatusPill>View-only access</StatusPill>
          )}
        </SectionHeader>

        <div className="space-y-4">
          {sortedMembers.map((member) => {
            const isMe = member.userId === membership.userId;
            const isOwner = member.userId === accountCreatorId;
            const isLastManager = member.role === "MANAGER" && managerCount === 1;
            const canManageThisMember =
              !isMe && (membership.canManageMembers || membership.canManageRoles);
            const grantedPermissions = editablePermissionKeys.filter(
              (key) => member[key]
            ).length;
            const hasAllOperationalPermissions =
              grantedPermissions === editablePermissionKeys.length;
            const accessLabel = isOwner
              ? "Protected account control"
              : member.role === "MANAGER" &&
                  (member.canManageMembers || member.canManageRoles)
                ? "Management access"
                : hasAllOperationalPermissions
                  ? "Full operational access"
                  : "Configured operational access";

            return (
              <Card key={member.id} className="reveal-rise p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 text-body font-semibold text-flash">
                        {(member.user.name ?? member.user.username)
                          .slice(0, 1)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-subsection text-flash">
                          {member.user.name ?? member.user.username}
                        </h3>
                        <p className="mt-1 text-caption text-muted">
                          @{member.user.username}
                        </p>
                      </div>
                      <StatusPill tone={isOwner ? "info" : "neutral"}>
                        <span className={getRoleTone(member.role, isOwner)}>
                          {getRoleLabel(member.role, isOwner)}
                        </span>
                      </StatusPill>
                      {isMe && <StatusPill tone="info">You</StatusPill>}
                      {isLastManager && (
                        <StatusPill tone="warning">Protected admin</StatusPill>
                      )}
                    </div>

                    <p className="mt-4 text-body font-medium text-flash">
                      {accessLabel} <span className="text-muted">&middot;</span>{" "}
                      <span className="font-normal text-muted">
                        {grantedPermissions}/{editablePermissionKeys.length} permissions
                      </span>
                    </p>
                    <p className="mt-2 max-w-3xl text-caption text-muted">
                      {getRoleDescription(
                        member.role,
                        isOwner,
                        member.canManageMembers,
                        member.canManageRoles
                      )}
                    </p>
                  </div>

                  <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:min-w-[330px]">
                    <div>
                      <p className="text-micro uppercase tracking-label text-muted-faint">
                        Joined
                      </p>
                      <p className="mt-1 text-caption text-muted">
                        {formatDate(member.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-micro uppercase tracking-label text-muted-faint">
                        Last seen
                      </p>
                      <p className="mt-1 text-caption text-muted">
                        {formatDate(member.user.lastActivityAt ?? member.user.lastSeenAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 px-4 py-3 text-caption text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                  {getAccessSummary(member).map((item, index) => (
                    <span key={item} className="inline-flex items-center gap-3">
                      {index > 0 && (
                        <span className="hidden text-muted-faint sm:inline" aria-hidden="true">
                          &middot;
                        </span>
                      )}
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`/accounts/${accountId}/members/${member.userId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/25 bg-accent-bright/[0.08] px-4 py-3 text-sm font-medium text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50"
                  >
                    <Eye size={16} />
                    View access dossier
                  </Link>
                  <Link
                    href={`/accounts/${accountId}/diary?member=${member.userId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-4 py-3 text-sm font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50"
                  >
                    <DoorOpen size={16} />
                    Open trades
                  </Link>
                </div>

                {canManageThisMember && (
                  <MemberManagementActions
                    key={`${member.userId}-${member.role}-${editablePermissionKeys
                      .map((key) => (member[key] ? "1" : "0"))
                      .join("")}`}
                    accountId={accountId}
                    targetUserId={member.userId}
                    currentRole={member.role}
                    currentPerms={{
                      canCreateTrades: member.canCreateTrades,
                      canEditTrades: member.canEditTrades,
                      canDeleteTrades: member.canDeleteTrades,
                      canViewAnalytics: member.canViewAnalytics,
                      canViewReports: member.canViewReports,
                      canViewCopilot: member.canViewCopilot,
                      canViewMembers: member.canViewMembers,
                    }}
                    canManageRoles={membership.canManageRoles}
                    canManageMembers={membership.canManageMembers}
                    isCreator={isOwner}
                    isLastManager={isLastManager}
                    t={managementLabels}
                  />
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-micro uppercase tracking-label text-accent-bright">
            Role model
          </p>
          <h2 className="mt-2 text-subsection text-flash">Access hierarchy</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-4">
          {[
          {
            icon: Crown,
            title: "Owner",
            text: "Creator-level account control. This identity is protected from removal or demotion.",
          },
          {
            icon: ShieldCheck,
            title: "Admin",
            text: "Manages access and role boundaries when granted management permissions.",
          },
          {
            icon: UserCog,
            title: "Member",
            text: "Executes account work through explicit trade and intelligence permissions.",
          },
          {
            icon: LockKeyhole,
            title: "Viewer",
            text: "Observes selected rooms without broad execution authority.",
          },
          ].map((item) => (
            <Card key={item.title} className="p-4">
              <div className="flex items-center gap-3">
                <item.icon size={16} className="shrink-0 text-muted" />
                <p className="text-micro font-medium uppercase tracking-label text-flash">
                  {item.title}
                </p>
              </div>
              <p className="mt-3 text-caption text-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
