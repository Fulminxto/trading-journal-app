"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/activity";
import {
  buildInviteNotification,
  buildInviteAcceptedNotification,
  buildInviteDeclinedNotification,
} from "@/lib/invite-i18n";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { MemberRole } from "@prisma/client";
import {
  ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE,
  isArchivedAccount,
} from "@/lib/account-write-guard";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getMembership(accountId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.accountMember.findFirst({
    where: { userId: session.user.id, tradingAccountId: accountId },
    include: { user: true, tradingAccount: true },
  });

  if (!membership) redirect("/accounts");

  return { membership, userId: session.user.id };
}

// ─── 1. inviteMember ──────────────────────────────────────────────────────────

export async function inviteMember(
  accountId: string,
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const { membership, userId } = await getMembership(accountId);

  if (!membership.canManageMembers) {
    return { error: "Non hai il permesso di invitare membri." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  const usernameRaw = formData.get("username");
  if (typeof usernameRaw !== "string" || !usernameRaw.trim()) {
    return { error: "Username non valido." };
  }
  const username = usernameRaw.trim();

  const roleRaw = formData.get("role");
  const role: MemberRole =
    roleRaw === "MANAGER" || roleRaw === "MEMBER" || roleRaw === "VIEWER"
      ? (roleRaw as MemberRole)
      : "MEMBER";

  // Cannot invite as MANAGER unless the inviter can manage roles
  if (role === "MANAGER" && !membership.canManageRoles) {
    return { error: "Non puoi invitare un utente come Manager." };
  }

  // Find target user
  const targetUser = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, appLanguage: true },
  });
  if (!targetUser) {
    return { error: "Utente non trovato. Verifica lo username." };
  }

  // Cannot invite yourself
  if (targetUser.id === userId) {
    return { error: "Non puoi invitare te stesso." };
  }

  // Already a member?
  const existing = await prisma.accountMember.findFirst({
    where: { userId: targetUser.id, tradingAccountId: accountId },
  });
  if (existing) {
    return { error: "L'utente è già membro di questo account." };
  }

  // Already has a pending invite?
  const existingInvite = await prisma.accountInvite.findFirst({
    where: { invitedUserId: targetUser.id, tradingAccountId: accountId },
  });
  if (existingInvite) {
    return { error: "Esiste già un invito pendente per questo utente." };
  }

  await prisma.accountInvite.create({
    data: {
      tradingAccountId: accountId,
      invitedUserId: targetUser.id,
      invitedByUserId: userId,
      role,
    },
  });

  const inviterName = membership.user.name ?? membership.user.username;
  const accountName = membership.tradingAccount.name;
  const { title, message } = buildInviteNotification(
    targetUser.appLanguage,
    inviterName,
    accountName,
    role
  );

  await createNotification({
    userId: targetUser.id,
    type: "ACCOUNT_INVITE",
    title,
    message,
    link: `/accounts/${accountId}/members`,
  });

  revalidatePath(`/accounts/${accountId}/members`);
  return {};
}

// ─── 2. cancelInvite ─────────────────────────────────────────────────────────

export async function cancelInvite(
  accountId: string,
  inviteId: string
): Promise<{ error?: string }> {
  const { membership } = await getMembership(accountId);

  if (!membership.canManageMembers) {
    return { error: "Non hai il permesso di annullare inviti." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  const invite = await prisma.accountInvite.findFirst({
    where: { id: inviteId, tradingAccountId: accountId },
  });
  if (!invite) return { error: "Invito non trovato." };

  await prisma.accountInvite.delete({ where: { id: inviteId } });

  revalidatePath(`/accounts/${accountId}/members`);
  return {};
}

// ─── 3. acceptInvite ─────────────────────────────────────────────────────────

const DEFAULT_PERMISSIONS: Record<MemberRole, Record<string, boolean>> = {
  MANAGER: {
    canCreateTrades: true,
    canEditTrades: true,
    canDeleteTrades: true,
    canViewAnalytics: true,
    canViewReports: true,
    canViewCopilot: true,
    canViewMembers: true,
    canManageMembers: true,
    canManageRoles: true,
    canManageAccount: true,
  },
  MEMBER: {
    canCreateTrades: true,
    canEditTrades: true,
    canDeleteTrades: true,
    canViewAnalytics: true,
    canViewReports: true,
    canViewCopilot: true,
    canViewMembers: true,
    canManageMembers: false,
    canManageRoles: false,
    canManageAccount: false,
  },
  VIEWER: {
    canCreateTrades: false,
    canEditTrades: false,
    canDeleteTrades: false,
    canViewAnalytics: true,
    canViewReports: true,
    canViewCopilot: false,
    canViewMembers: true,
    canManageMembers: false,
    canManageRoles: false,
    canManageAccount: false,
  },
};

export async function acceptInvite(
  accountId: string
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const invite = await prisma.accountInvite.findFirst({
    where: { invitedUserId: userId, tradingAccountId: accountId },
    include: { invitedBy: { select: { id: true, appLanguage: true } }, tradingAccount: { select: { name: true, status: true } } },
  });
  if (!invite) return { error: "Nessun invito trovato per questo account." };
  if (isArchivedAccount(invite.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, name: true },
  });
  const inviteeName = user?.name ?? user?.username ?? "Utente";
  const accountName = invite.tradingAccount.name;

  const permissions = DEFAULT_PERMISSIONS[invite.role];

  await prisma.$transaction([
    prisma.accountMember.create({
      data: {
        userId,
        tradingAccountId: accountId,
        role: invite.role,
        ...permissions,
      },
    }),
    prisma.accountInvite.delete({ where: { id: invite.id } }),
  ]);

  // Notify the inviter
  const { title, message } = buildInviteAcceptedNotification(
    invite.invitedBy.appLanguage,
    inviteeName,
    accountName
  );
  await createNotification({
    userId: invite.invitedBy.id,
    type: "ACCOUNT_INVITE_ACCEPTED",
    title,
    message,
    link: `/accounts/${accountId}/members`,
  });

  revalidatePath(`/accounts/${accountId}/members`);
  redirect(`/accounts/${accountId}/dashboard`);
}

// ─── 4. declineInvite ────────────────────────────────────────────────────────

export async function declineInvite(
  accountId: string
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const invite = await prisma.accountInvite.findFirst({
    where: { invitedUserId: userId, tradingAccountId: accountId },
    include: { invitedBy: { select: { id: true, appLanguage: true } }, tradingAccount: { select: { name: true, status: true } } },
  });
  if (!invite) return { error: "Nessun invito trovato per questo account." };
  if (isArchivedAccount(invite.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, name: true },
  });
  const inviteeName = user?.name ?? user?.username ?? "Utente";
  const accountName = invite.tradingAccount.name;

  await prisma.accountInvite.delete({ where: { id: invite.id } });

  // Discrete notification to the inviter
  const { title, message } = buildInviteDeclinedNotification(
    invite.invitedBy.appLanguage,
    inviteeName,
    accountName
  );
  await createNotification({
    userId: invite.invitedBy.id,
    type: "ACCOUNT_INVITE_DECLINED",
    title,
    message,
    link: `/accounts/${accountId}/members`,
  });

  revalidatePath(`/accounts/${accountId}/members`);
  return {};
}

// ─── 5. removeMember ─────────────────────────────────────────────────────────

export async function removeMember(
  accountId: string,
  targetUserId: string
): Promise<{ error?: string }> {
  const { membership, userId } = await getMembership(accountId);

  if (!membership.canManageMembers) {
    return { error: "Non hai il permesso di rimuovere membri." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  // Cannot remove yourself
  if (targetUserId === userId) {
    return { error: "Non puoi rimuovere te stesso dall'account." };
  }

  const target = await prisma.accountMember.findFirst({
    where: { userId: targetUserId, tradingAccountId: accountId },
    include: { user: { select: { id: true, appLanguage: true, username: true, name: true } } },
  });
  if (!target) return { error: "Membro non trovato." };

  // Cannot remove the account creator
  if (membership.tradingAccount.createdById === targetUserId) {
    return { error: "Non puoi rimuovere il creatore dell'account." };
  }

  // Cannot remove another MANAGER without canManageRoles
  if (target.role === "MANAGER" && !membership.canManageRoles) {
    return { error: "Non hai il permesso di rimuovere un Manager." };
  }

  // Last-MANAGER protection
  if (target.role === "MANAGER") {
    const managerCount = await prisma.accountMember.count({
      where: { tradingAccountId: accountId, role: "MANAGER" },
    });
    if (managerCount <= 1) {
      return { error: "Non puoi rimuovere l'unico Manager dell'account." };
    }
  }

  await prisma.accountMember.delete({ where: { id: target.id } });

  revalidatePath(`/accounts/${accountId}/members`);
  return {};
}

// ─── 6. changeMemberRole ─────────────────────────────────────────────────────

export async function changeMemberRole(
  accountId: string,
  targetUserId: string,
  newRole: MemberRole
): Promise<{ error?: string }> {
  const { membership, userId } = await getMembership(accountId);

  if (!membership.canManageRoles) {
    return { error: "Non hai il permesso di cambiare i ruoli." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  if (targetUserId === userId) {
    return { error: "Non puoi cambiare il tuo stesso ruolo." };
  }

  const target = await prisma.accountMember.findFirst({
    where: { userId: targetUserId, tradingAccountId: accountId },
    include: { user: { select: { id: true, appLanguage: true } } },
  });
  if (!target) return { error: "Membro non trovato." };

  // Cannot demote the account creator
  if (membership.tradingAccount.createdById === targetUserId && newRole !== "MANAGER") {
    return { error: "Non puoi retrocedere il creatore dell'account." };
  }

  // Last-MANAGER protection when demoting
  if (target.role === "MANAGER" && newRole !== "MANAGER") {
    const managerCount = await prisma.accountMember.count({
      where: { tradingAccountId: accountId, role: "MANAGER" },
    });
    if (managerCount <= 1) {
      return { error: "Non puoi retrocedere l'unico Manager dell'account." };
    }
  }

  // Apply default permissions for new role
  const newPermissions = DEFAULT_PERMISSIONS[newRole];

  await prisma.accountMember.update({
    where: { id: target.id },
    data: { role: newRole, ...newPermissions },
  });

  revalidatePath(`/accounts/${accountId}/members`);
  return {};
}

// ─── 7. updateMemberPermissions ──────────────────────────────────────────────

const ALLOWED_PERMISSION_KEYS = [
  "canCreateTrades",
  "canEditTrades",
  "canDeleteTrades",
  "canViewAnalytics",
  "canViewReports",
  "canViewCopilot",
  "canViewMembers",
] as const;

type AllowedPermissionKey = (typeof ALLOWED_PERMISSION_KEYS)[number];

export async function updateMemberPermissions(
  accountId: string,
  targetUserId: string,
  permissions: Partial<Record<AllowedPermissionKey, boolean>>
): Promise<{ error?: string }> {
  const { membership, userId } = await getMembership(accountId);

  if (!membership.canManageRoles) {
    return { error: "Non hai il permesso di modificare i permessi." };
  }
  if (isArchivedAccount(membership.tradingAccount.status)) {
    return { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE };
  }

  if (targetUserId === userId) {
    return { error: "Non puoi modificare i tuoi stessi permessi." };
  }

  const target = await prisma.accountMember.findFirst({
    where: { userId: targetUserId, tradingAccountId: accountId },
  });
  if (!target) return { error: "Membro non trovato." };

  // Strip any canManage* keys — those cannot be toggled via this action
  const safePermissions: Partial<Record<AllowedPermissionKey, boolean>> = {};
  for (const key of ALLOWED_PERMISSION_KEYS) {
    if (key in permissions && typeof permissions[key] === "boolean") {
      safePermissions[key] = permissions[key];
    }
  }

  await prisma.accountMember.update({
    where: { id: target.id },
    data: safePermissions,
  });

  revalidatePath(`/accounts/${accountId}/members`);
  return {};
}
