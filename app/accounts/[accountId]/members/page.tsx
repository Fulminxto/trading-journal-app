import {
    Activity,
    ArrowLeft,
    Clock3,
    Radio,
    UserPlus,
    Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    normalizeAppLanguage,
    getLocaleFromLanguage,
    type AppLanguage,
} from "@/lib/i18n";
import { InviteMemberForm, CancelInviteButton } from "./invite-form";
import { MemberManagementActions } from "./member-actions";

type MembersLabels = {
    never: string;
    accountMembers: string;
    membersActivity: string;
    description: string;
    members: string;
    onlineNow: string;
    activeToday: string;
    totalTrades: string;
    lastTrade: string;
    noTrades: string;
    latestTradeDescription: string;
    mostActive: string;
    basedOnInsertedTrades: string;
    livePresence: string;
    activeLastFiveMinutes: string;
    accountStatus: string;
    live: string;
    quiet: string;
    presenceSnapshot: string;
    leaderboard: string;
    mostActiveMembers: string;
    topFive: string;
    trades: string;
    onlineMembers: string;
    activeNow: string;
    noOnlineMembers: string;
    memberOverview: string;
    accountTeam: string;
    activityProfile: string;
    lastActivity: string;
    lastLogin: string;
    viewMemberTrades: string;
    memberAnalytics: string;
    openWorkspace: string;
    backToAccount: string;
    onlineStatus: string;
    activeTodayStatus: string;
    activeThisWeekStatus: string;
    inactiveStatus: string;
    notAvailable: string;
    // Management
    teamManagementSection: string;
    managementSectionLabel: string;
    inviteMemberHeading: string;
    usernamePlaceholder: string;
    sendInvite: string;
    pendingInvitesHeading: string;
    noPendingInvites: string;
    cancelInvite: string;
    invitedAs: string;
    changeRoleLabel: string;
    saveRole: string;
    permissionsLabel: string;
    savePermissions: string;
    removeMemberLabel: string;
    confirmRemove: string;
    confirmYes: string;
    cancelConfirm: string;
    youBadge: string;
    creatorBadge: string;
    lastManagerNote: string;
    roleManager: string;
    roleMember: string;
    roleViewer: string;
    perm_canCreateTrades: string;
    perm_canEditTrades: string;
    perm_canDeleteTrades: string;
    perm_canViewAnalytics: string;
    perm_canViewReports: string;
    perm_canViewCopilot: string;
    perm_canViewMembers: string;
};

const labels: Record<AppLanguage, MembersLabels> = {
    it: {
        never: "Mai",
        accountMembers: "Membri account",
        membersActivity: "AttivitÃƒÂ  membri",
        description:
            "Monitora presenza, attivitÃƒÂ  e contributo operativo dei membri dentro questo account condiviso.",
        members: "Membri",
        onlineNow: "Online ora",
        activeToday: "Attivi oggi",
        totalTrades: "Trade totali",
        lastTrade: "Ultimo trade",
        noTrades: "Nessun trade",
        latestTradeDescription: "Ultimo trade registrato in questo account.",
        mostActive: "PiÃƒÂ¹ attivo",
        basedOnInsertedTrades: "Basato sui trade inseriti.",
        livePresence: "Presenza live",
        activeLastFiveMinutes: "Attivi negli ultimi 5 minuti.",
        accountStatus: "Stato account",
        live: "Live",
        quiet: "Silenzioso",
        presenceSnapshot: "Snapshot di presenza e attivitÃƒÂ .",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Membri piÃƒÂ¹ attivi",
        topFive: "Top 5",
        trades: "trade",
        onlineMembers: "Membri online",
        activeNow: "Attivo ora",
        noOnlineMembers: "Nessun membro online ora.",
        memberOverview: "Panoramica membri",
        accountTeam: "Team account",
        activityProfile:
            "Profilo attivitÃƒÂ  basato su presenza, ultima attivitÃƒÂ  e contributo operativo dentro questo account.",
        lastActivity: "Ultima attivitÃƒÂ ",
        lastLogin: "Ultimo login",
        viewMemberTrades: "Vedi trade membro",
        memberAnalytics: "Analytics membro",
        openWorkspace: "Apri workspace",
        backToAccount: "Torna all'account",
        onlineStatus: "Online ora",
        activeTodayStatus: "Attivo oggi",
        activeThisWeekStatus: "Attivo questa settimana",
        inactiveStatus: "Inattivo",
        notAvailable: "N/D",
        teamManagementSection: "Gestione team",
        managementSectionLabel: "Gestione",
        inviteMemberHeading: "Invita membro",
        usernamePlaceholder: "Username",
        sendInvite: "Invia invito",
        pendingInvitesHeading: "Inviti in attesa",
        noPendingInvites: "Nessun invito in attesa.",
        cancelInvite: "Annulla invito",
        invitedAs: "Invitato come",
        changeRoleLabel: "Cambia ruolo",
        saveRole: "Salva ruolo",
        permissionsLabel: "Permessi operativi",
        savePermissions: "Salva permessi",
        removeMemberLabel: "Rimuovi membro",
        confirmRemove: "Sei sicuro? L'azione ÃƒÂ¨ irreversibile.",
        confirmYes: "SÃƒÂ¬, rimuovi",
        cancelConfirm: "Annulla",
        youBadge: "Tu",
        creatorBadge: "Creatore",
        lastManagerNote: "Unico Manager Ã¢â‚¬â€ impossibile retrocedere.",
        roleManager: "Manager",
        roleMember: "Membro",
        roleViewer: "Osservatore",
        perm_canCreateTrades: "Inserisci trade",
        perm_canEditTrades: "Modifica trade",
        perm_canDeleteTrades: "Elimina trade",
        perm_canViewAnalytics: "Analytics",
        perm_canViewReports: "Report",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "Vedi team",
    },
    en: {
        never: "Never",
        accountMembers: "Account Members",
        membersActivity: "Members Activity",
        description:
            "Monitor presence, activity and operational contribution of members inside this shared account.",
        members: "Members",
        onlineNow: "Online Now",
        activeToday: "Active Today",
        totalTrades: "Total Trades",
        lastTrade: "Last Trade",
        noTrades: "No trades",
        latestTradeDescription: "Latest trade across this account.",
        mostActive: "Most Active",
        basedOnInsertedTrades: "Based on inserted trades.",
        livePresence: "Live Presence",
        activeLastFiveMinutes: "Active in the last 5 minutes.",
        accountStatus: "Account Status",
        live: "Live",
        quiet: "Quiet",
        presenceSnapshot: "Presence and activity snapshot.",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Most Active Members",
        topFive: "Top 5",
        trades: "trades",
        onlineMembers: "Online Members",
        activeNow: "Active now",
        noOnlineMembers: "No members online now.",
        memberOverview: "Member Overview",
        accountTeam: "Account Team",
        activityProfile:
            "Activity profile based on login presence, last activity and trade contribution inside this account.",
        lastActivity: "Last Activity",
        lastLogin: "Last Login",
        viewMemberTrades: "View Member Trades",
        memberAnalytics: "Member Analytics",
        openWorkspace: "Open Workspace",
        backToAccount: "Back to account",
        onlineStatus: "Online Now",
        activeTodayStatus: "Active Today",
        activeThisWeekStatus: "Active This Week",
        inactiveStatus: "Inactive",
        notAvailable: "N/A",
        teamManagementSection: "Team management",
        managementSectionLabel: "Manage",
        inviteMemberHeading: "Invite member",
        usernamePlaceholder: "Username",
        sendInvite: "Send invite",
        pendingInvitesHeading: "Pending invites",
        noPendingInvites: "No pending invites.",
        cancelInvite: "Cancel invite",
        invitedAs: "Invited as",
        changeRoleLabel: "Change role",
        saveRole: "Save role",
        permissionsLabel: "Permissions",
        savePermissions: "Save permissions",
        removeMemberLabel: "Remove member",
        confirmRemove: "Are you sure? This cannot be undone.",
        confirmYes: "Yes, remove",
        cancelConfirm: "Cancel",
        youBadge: "You",
        creatorBadge: "Creator",
        lastManagerNote: "Only Manager Ã¢â‚¬â€ cannot be demoted.",
        roleManager: "Manager",
        roleMember: "Member",
        roleViewer: "Viewer",
        perm_canCreateTrades: "Create trades",
        perm_canEditTrades: "Edit trades",
        perm_canDeleteTrades: "Delete trades",
        perm_canViewAnalytics: "Analytics",
        perm_canViewReports: "Reports",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "View team",
    },
    uk: {
        never: "ÃÂÃ‘â€“ÃÂºÃÂ¾ÃÂ»ÃÂ¸",
        accountMembers: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂ°",
        membersActivity: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ²",
        description:
            "ÃÅ“ÃÂ¾ÃÂ½Ã‘â€“Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ¸ÃÂ½ÃÂ³ ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“, ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“ Ã‘â€šÃÂ° ÃÂ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ Ã‘â€“ÃÂ¹ÃÂ½ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ²ÃÂ½ÃÂµÃ‘ÂÃÂºÃ‘Æ’ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ² Ã‘Æ’ Ã‘â€ Ã‘Å’ÃÂ¾ÃÂ¼Ã‘Æ’ Ã‘ÂÃÂ¿Ã‘â€“ÃÂ»Ã‘Å’ÃÂ½ÃÂ¾ÃÂ¼Ã‘Æ’ ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃ‘â€“.",
        members: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        onlineNow: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½ ÃÂ·ÃÂ°Ã‘â‚¬ÃÂ°ÃÂ·",
        activeToday: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“ Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘â€“",
        totalTrades: "ÃÂ£Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´",
        lastTrade: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Â Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´ÃÂ°",
        noTrades: "ÃÂÃÂµÃÂ¼ÃÂ°Ã‘â€ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´",
        latestTradeDescription: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Â Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´ÃÂ° ÃÂ² Ã‘â€ Ã‘Å’ÃÂ¾ÃÂ¼Ã‘Æ’ ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃ‘â€“.",
        mostActive: "ÃÂÃÂ°ÃÂ¹ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘Ë†ÃÂ¸ÃÂ¹",
        basedOnInsertedTrades: "ÃÂÃÂ° ÃÂ¾Ã‘ÂÃÂ½ÃÂ¾ÃÂ²Ã‘â€“ ÃÂ²ÃÂ½ÃÂµÃ‘ÂÃÂµÃÂ½ÃÂ¸Ã‘â€¦ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´.",
        livePresence: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½-ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’",
        activeLastFiveMinutes: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“ ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘â€šÃ‘ÂÃÂ³ÃÂ¾ÃÂ¼ ÃÂ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘â€“Ã‘â€¦ 5 Ã‘â€¦ÃÂ²ÃÂ¸ÃÂ»ÃÂ¸ÃÂ½.",
        accountStatus: "ÃÂ¡Ã‘â€šÃÂ°Ã‘â€šÃ‘Æ’Ã‘Â ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂ°",
        live: "Live",
        quiet: "ÃÂ¢ÃÂ¸Ã‘â€¦ÃÂ¾",
        presenceSnapshot: "Ãâ€”ÃÂ½Ã‘â€“ÃÂ¼ÃÂ¾ÃÂº ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“ Ã‘â€šÃÂ° ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“.",
        leaderboard: "ÃÂ ÃÂµÃÂ¹Ã‘â€šÃÂ¸ÃÂ½ÃÂ³",
        mostActiveMembers: "ÃÂÃÂ°ÃÂ¹ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘Ë†Ã‘â€“ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        topFive: "ÃÂ¢ÃÂ¾ÃÂ¿ 5",
        trades: "Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´",
        onlineMembers: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        activeNow: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¸ÃÂ¹ ÃÂ·ÃÂ°Ã‘â‚¬ÃÂ°ÃÂ·",
        noOnlineMembers: "Ãâ€”ÃÂ°Ã‘â‚¬ÃÂ°ÃÂ· ÃÂ½ÃÂµÃÂ¼ÃÂ°Ã‘â€ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ² ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½.",
        memberOverview: "ÃÅ¾ÃÂ³ÃÂ»Ã‘ÂÃÂ´ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ²",
        accountTeam: "ÃÅ¡ÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´ÃÂ° ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂ°",
        activityProfile:
            "ÃÅ¸Ã‘â‚¬ÃÂ¾Ã‘â€žÃ‘â€“ÃÂ»Ã‘Å’ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“ ÃÂ½ÃÂ° ÃÂ¾Ã‘ÂÃÂ½ÃÂ¾ÃÂ²Ã‘â€“ ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“, ÃÂ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Å’ÃÂ¾Ã‘â€” ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“ Ã‘â€šÃÂ° Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ³ÃÂ¾ÃÂ²ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ²ÃÂ½ÃÂµÃ‘ÂÃÂºÃ‘Æ’ ÃÂ² Ã‘â€ Ã‘Å’ÃÂ¾ÃÂ¼Ã‘Æ’ ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃ‘â€“.",
        lastActivity: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Â ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’",
        lastLogin: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘â€“ÃÂ¹ ÃÂ²Ã‘â€¦Ã‘â€“ÃÂ´",
        viewMemberTrades: "ÃÅ¸ÃÂµÃ‘â‚¬ÃÂµÃÂ³ÃÂ»Ã‘ÂÃÂ½Ã‘Æ’Ã‘â€šÃÂ¸ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´ÃÂ¸ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ°",
        memberAnalytics: "ÃÂÃÂ½ÃÂ°ÃÂ»Ã‘â€“Ã‘â€šÃÂ¸ÃÂºÃÂ° Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ°",
        openWorkspace: "Ãâ€™Ã‘â€“ÃÂ´ÃÂºÃ‘â‚¬ÃÂ¸Ã‘â€šÃÂ¸ workspace",
        backToAccount: "ÃÂÃÂ°ÃÂ·ÃÂ°ÃÂ´ ÃÂ´ÃÂ¾ ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂ°",
        onlineStatus: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½ ÃÂ·ÃÂ°Ã‘â‚¬ÃÂ°ÃÂ·",
        activeTodayStatus: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¸ÃÂ¹ Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘â€“",
        activeThisWeekStatus: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¸ÃÂ¹ Ã‘â€ Ã‘Å’ÃÂ¾ÃÂ³ÃÂ¾ Ã‘â€šÃÂ¸ÃÂ¶ÃÂ½Ã‘Â",
        inactiveStatus: "ÃÂÃÂµÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¸ÃÂ¹",
        notAvailable: "ÃÂ/Ãâ€",
        teamManagementSection: "ÃÂ£ÃÂ¿Ã‘â‚¬ÃÂ°ÃÂ²ÃÂ»Ã‘â€“ÃÂ½ÃÂ½Ã‘Â ÃÂºÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´ÃÂ¾Ã‘Å½",
        managementSectionLabel: "ÃÂ£ÃÂ¿Ã‘â‚¬ÃÂ°ÃÂ²ÃÂ»Ã‘â€“ÃÂ½ÃÂ½Ã‘Â",
        inviteMemberHeading: "Ãâ€”ÃÂ°ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘ÂÃÂ¸Ã‘â€šÃÂ¸ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ°",
        usernamePlaceholder: "Username",
        sendInvite: "ÃÂÃÂ°ÃÂ´Ã‘â€“Ã‘ÂÃÂ»ÃÂ°Ã‘â€šÃÂ¸ ÃÂ·ÃÂ°ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘Ë†ÃÂµÃÂ½ÃÂ½Ã‘Â",
        pendingInvitesHeading: "Ãâ€”ÃÂ°ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘Ë†ÃÂµÃÂ½ÃÂ½Ã‘Â ÃÂ² ÃÂ¾Ã‘â€¡Ã‘â€“ÃÂºÃ‘Æ’ÃÂ²ÃÂ°ÃÂ½ÃÂ½Ã‘â€“",
        noPendingInvites: "ÃÂÃÂµÃÂ¼ÃÂ°Ã‘â€ ÃÂ·ÃÂ°ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘Ë†ÃÂµÃÂ½Ã‘Å’ ÃÂ² ÃÂ¾Ã‘â€¡Ã‘â€“ÃÂºÃ‘Æ’ÃÂ²ÃÂ°ÃÂ½ÃÂ½Ã‘â€“.",
        cancelInvite: "ÃÂ¡ÃÂºÃÂ°Ã‘ÂÃ‘Æ’ÃÂ²ÃÂ°Ã‘â€šÃÂ¸ ÃÂ·ÃÂ°ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘Ë†ÃÂµÃÂ½ÃÂ½Ã‘Â",
        invitedAs: "Ãâ€”ÃÂ°ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘Ë†ÃÂµÃÂ½ÃÂ¸ÃÂ¹ Ã‘ÂÃÂº",
        changeRoleLabel: "Ãâ€”ÃÂ¼Ã‘â€“ÃÂ½ÃÂ¸Ã‘â€šÃÂ¸ Ã‘â‚¬ÃÂ¾ÃÂ»Ã‘Å’",
        saveRole: "Ãâ€”ÃÂ±ÃÂµÃ‘â‚¬ÃÂµÃÂ³Ã‘â€šÃÂ¸ Ã‘â‚¬ÃÂ¾ÃÂ»Ã‘Å’",
        permissionsLabel: "ÃÅ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ Ã‘â€“ÃÂ¹ÃÂ½Ã‘â€“ ÃÂ´ÃÂ¾ÃÂ·ÃÂ²ÃÂ¾ÃÂ»ÃÂ¸",
        savePermissions: "Ãâ€”ÃÂ±ÃÂµÃ‘â‚¬ÃÂµÃÂ³Ã‘â€šÃÂ¸ ÃÂ´ÃÂ¾ÃÂ·ÃÂ²ÃÂ¾ÃÂ»ÃÂ¸",
        removeMemberLabel: "Ãâ€™ÃÂ¸ÃÂ´ÃÂ°ÃÂ»ÃÂ¸Ã‘â€šÃÂ¸ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ°",
        confirmRemove: "Ãâ€™ÃÂ¸ ÃÂ²ÃÂ¿ÃÂµÃÂ²ÃÂ½ÃÂµÃÂ½Ã‘â€“? ÃÂ¦Ã‘Å½ ÃÂ´Ã‘â€“Ã‘Å½ ÃÂ½ÃÂµ ÃÂ¼ÃÂ¾ÃÂ¶ÃÂ½ÃÂ° Ã‘ÂÃÂºÃÂ°Ã‘ÂÃ‘Æ’ÃÂ²ÃÂ°Ã‘â€šÃÂ¸.",
        confirmYes: "ÃÂ¢ÃÂ°ÃÂº, ÃÂ²ÃÂ¸ÃÂ´ÃÂ°ÃÂ»ÃÂ¸Ã‘â€šÃÂ¸",
        cancelConfirm: "ÃÂ¡ÃÂºÃÂ°Ã‘ÂÃ‘Æ’ÃÂ²ÃÂ°Ã‘â€šÃÂ¸",
        youBadge: "ÃÂ¢ÃÂ¸",
        creatorBadge: "ÃÂ¢ÃÂ²ÃÂ¾Ã‘â‚¬ÃÂµÃ‘â€ Ã‘Å’",
        lastManagerNote: "Ãâ€žÃÂ´ÃÂ¸ÃÂ½ÃÂ¸ÃÂ¹ Manager Ã¢â‚¬â€ ÃÂ½ÃÂµÃÂ¼ÃÂ¾ÃÂ¶ÃÂ»ÃÂ¸ÃÂ²ÃÂ¾ ÃÂ¿ÃÂ¾ÃÂ½ÃÂ¸ÃÂ·ÃÂ¸Ã‘â€šÃÂ¸.",
        roleManager: "ÃÅ“ÃÂµÃÂ½ÃÂµÃÂ´ÃÂ¶ÃÂµÃ‘â‚¬",
        roleMember: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂº",
        roleViewer: "ÃÂ¡ÃÂ¿ÃÂ¾Ã‘ÂÃ‘â€šÃÂµÃ‘â‚¬Ã‘â€“ÃÂ³ÃÂ°Ã‘â€¡",
        perm_canCreateTrades: "Ãâ€™ÃÂ½ÃÂ¾Ã‘ÂÃÂ¸Ã‘â€šÃÂ¸ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´ÃÂ¸",
        perm_canEditTrades: "ÃÂ ÃÂµÃÂ´ÃÂ°ÃÂ³Ã‘Æ’ÃÂ²ÃÂ°Ã‘â€šÃÂ¸ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´ÃÂ¸",
        perm_canDeleteTrades: "Ãâ€™ÃÂ¸ÃÂ´ÃÂ°ÃÂ»Ã‘ÂÃ‘â€šÃÂ¸ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´ÃÂ¸",
        perm_canViewAnalytics: "ÃÂÃÂ½ÃÂ°ÃÂ»Ã‘â€“Ã‘â€šÃÂ¸ÃÂºÃÂ°",
        perm_canViewReports: "Ãâ€”ÃÂ²Ã‘â€“Ã‘â€šÃÂ¸",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "ÃÅ¸ÃÂµÃ‘â‚¬ÃÂµÃÂ³ÃÂ»Ã‘ÂÃÂ´ÃÂ°Ã‘â€šÃÂ¸ ÃÂºÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´Ã‘Æ’",
    },
    ru: {
        never: "ÃÂÃÂ¸ÃÂºÃÂ¾ÃÂ³ÃÂ´ÃÂ°",
        accountMembers: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂ°",
        membersActivity: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ²",
        description:
            "ÃÅ“ÃÂ¾ÃÂ½ÃÂ¸Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ¸ÃÂ½ÃÂ³ ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃ‘ÂÃ‘â€šÃÂ²ÃÂ¸Ã‘Â, ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¸ ÃÂ¸ ÃÂ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ ÃÂ¸ÃÂ¾ÃÂ½ÃÂ½ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ²ÃÂºÃÂ»ÃÂ°ÃÂ´ÃÂ° Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ² ÃÂ² Ã‘ÂÃ‘â€šÃÂ¾ÃÂ¼ ÃÂ¾ÃÂ±Ã‘â€°ÃÂµÃÂ¼ ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂµ.",
        members: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        onlineNow: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½ Ã‘ÂÃÂµÃÂ¹Ã‘â€¡ÃÂ°Ã‘Â",
        activeToday: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ Ã‘ÂÃÂµÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘Â",
        totalTrades: "Ãâ€™Ã‘ÂÃÂµÃÂ³ÃÂ¾ Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂ¾ÃÂº",
        lastTrade: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½Ã‘ÂÃ‘Â Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂºÃÂ°",
        noTrades: "ÃÂÃÂµÃ‘â€š Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂ¾ÃÂº",
        latestTradeDescription: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½Ã‘ÂÃ‘Â Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂºÃÂ° ÃÂ² Ã‘ÂÃ‘â€šÃÂ¾ÃÂ¼ ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂµ.",
        mostActive: "ÃÂ¡ÃÂ°ÃÂ¼Ã‘â€¹ÃÂ¹ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ÃÂ¹",
        basedOnInsertedTrades: "ÃÂÃÂ° ÃÂ¾Ã‘ÂÃÂ½ÃÂ¾ÃÂ²ÃÂµ ÃÂ²ÃÂ½ÃÂµÃ‘ÂÃÂµÃÂ½ÃÂ½Ã‘â€¹Ã‘â€¦ Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂ¾ÃÂº.",
        livePresence: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½-ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃ‘ÂÃ‘â€šÃÂ²ÃÂ¸ÃÂµ",
        activeLastFiveMinutes: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ ÃÂ·ÃÂ° ÃÂ¿ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½ÃÂ¸ÃÂµ 5 ÃÂ¼ÃÂ¸ÃÂ½Ã‘Æ’Ã‘â€š.",
        accountStatus: "ÃÂ¡Ã‘â€šÃÂ°Ã‘â€šÃ‘Æ’Ã‘Â ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂ°",
        live: "Live",
        quiet: "ÃÂ¢ÃÂ¸Ã‘â€¦ÃÂ¾",
        presenceSnapshot: "ÃÂ¡ÃÂ½ÃÂ¸ÃÂ¼ÃÂ¾ÃÂº ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃ‘ÂÃ‘â€šÃÂ²ÃÂ¸Ã‘Â ÃÂ¸ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¸.",
        leaderboard: "ÃÂ ÃÂµÃÂ¹Ã‘â€šÃÂ¸ÃÂ½ÃÂ³",
        mostActiveMembers: "ÃÂ¡ÃÂ°ÃÂ¼Ã‘â€¹ÃÂµ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ÃÂµ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        topFive: "ÃÂ¢ÃÂ¾ÃÂ¿ 5",
        trades: "Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂ¾ÃÂº",
        onlineMembers: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        activeNow: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂµÃÂ½ Ã‘ÂÃÂµÃÂ¹Ã‘â€¡ÃÂ°Ã‘Â",
        noOnlineMembers: "ÃÂ¡ÃÂµÃÂ¹Ã‘â€¡ÃÂ°Ã‘Â ÃÂ½ÃÂµÃ‘â€š Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ² ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½.",
        memberOverview: "ÃÅ¾ÃÂ±ÃÂ·ÃÂ¾Ã‘â‚¬ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ²",
        accountTeam: "ÃÅ¡ÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´ÃÂ° ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂ°",
        activityProfile:
            "ÃÅ¸Ã‘â‚¬ÃÂ¾Ã‘â€žÃÂ¸ÃÂ»Ã‘Å’ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¸ ÃÂ½ÃÂ° ÃÂ¾Ã‘ÂÃÂ½ÃÂ¾ÃÂ²ÃÂµ ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃ‘ÂÃ‘â€šÃÂ²ÃÂ¸Ã‘Â, ÃÂ¿ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½ÃÂµÃÂ¹ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¸ ÃÂ¸ Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ³ÃÂ¾ÃÂ²ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ²ÃÂºÃÂ»ÃÂ°ÃÂ´ÃÂ° ÃÂ² Ã‘ÂÃ‘â€šÃÂ¾ÃÂ¼ ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂµ.",
        lastActivity: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½Ã‘ÂÃ‘Â ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’",
        lastLogin: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½ÃÂ¸ÃÂ¹ ÃÂ²Ã‘â€¦ÃÂ¾ÃÂ´",
        viewMemberTrades: "ÃÂ¡ÃÂ¼ÃÂ¾Ã‘â€šÃ‘â‚¬ÃÂµÃ‘â€šÃ‘Å’ Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂºÃÂ¸ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ°",
        memberAnalytics: "ÃÂÃÂ½ÃÂ°ÃÂ»ÃÂ¸Ã‘â€šÃÂ¸ÃÂºÃÂ° Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ°",
        openWorkspace: "ÃÅ¾Ã‘â€šÃÂºÃ‘â‚¬Ã‘â€¹Ã‘â€šÃ‘Å’ workspace",
        backToAccount: "ÃÂÃÂ°ÃÂ·ÃÂ°ÃÂ´ ÃÂº ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃ‘Æ’",
        onlineStatus: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½ Ã‘ÂÃÂµÃÂ¹Ã‘â€¡ÃÂ°Ã‘Â",
        activeTodayStatus: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂµÃÂ½ Ã‘ÂÃÂµÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘Â",
        activeThisWeekStatus: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂµÃÂ½ ÃÂ½ÃÂ° Ã‘ÂÃ‘â€šÃÂ¾ÃÂ¹ ÃÂ½ÃÂµÃÂ´ÃÂµÃÂ»ÃÂµ",
        inactiveStatus: "ÃÂÃÂµÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂµÃÂ½",
        notAvailable: "ÃÂ/Ãâ€",
        teamManagementSection: "ÃÂ£ÃÂ¿Ã‘â‚¬ÃÂ°ÃÂ²ÃÂ»ÃÂµÃÂ½ÃÂ¸ÃÂµ ÃÂºÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´ÃÂ¾ÃÂ¹",
        managementSectionLabel: "ÃÂ£ÃÂ¿Ã‘â‚¬ÃÂ°ÃÂ²ÃÂ»ÃÂµÃÂ½ÃÂ¸ÃÂµ",
        inviteMemberHeading: "ÃÅ¸Ã‘â‚¬ÃÂ¸ÃÂ³ÃÂ»ÃÂ°Ã‘ÂÃÂ¸Ã‘â€šÃ‘Å’ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ°",
        usernamePlaceholder: "Username",
        sendInvite: "ÃÅ¾Ã‘â€šÃÂ¿Ã‘â‚¬ÃÂ°ÃÂ²ÃÂ¸Ã‘â€šÃ‘Å’ ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ³ÃÂ»ÃÂ°Ã‘Ë†ÃÂµÃÂ½ÃÂ¸ÃÂµ",
        pendingInvitesHeading: "ÃÅ¾ÃÂ¶ÃÂ¸ÃÂ´ÃÂ°Ã‘Å½Ã‘â€°ÃÂ¸ÃÂµ ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ³ÃÂ»ÃÂ°Ã‘Ë†ÃÂµÃÂ½ÃÂ¸Ã‘Â",
        noPendingInvites: "ÃÂÃÂµÃ‘â€š ÃÂ¾ÃÂ¶ÃÂ¸ÃÂ´ÃÂ°Ã‘Å½Ã‘â€°ÃÂ¸Ã‘â€¦ ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ³ÃÂ»ÃÂ°Ã‘Ë†ÃÂµÃÂ½ÃÂ¸ÃÂ¹.",
        cancelInvite: "ÃÅ¾Ã‘â€šÃÂ¼ÃÂµÃÂ½ÃÂ¸Ã‘â€šÃ‘Å’ ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ³ÃÂ»ÃÂ°Ã‘Ë†ÃÂµÃÂ½ÃÂ¸ÃÂµ",
        invitedAs: "ÃÅ¸Ã‘â‚¬ÃÂ¸ÃÂ³ÃÂ»ÃÂ°Ã‘Ë†Ã‘â€˜ÃÂ½ ÃÂºÃÂ°ÃÂº",
        changeRoleLabel: "ÃËœÃÂ·ÃÂ¼ÃÂµÃÂ½ÃÂ¸Ã‘â€šÃ‘Å’ Ã‘â‚¬ÃÂ¾ÃÂ»Ã‘Å’",
        saveRole: "ÃÂ¡ÃÂ¾Ã‘â€¦Ã‘â‚¬ÃÂ°ÃÂ½ÃÂ¸Ã‘â€šÃ‘Å’ Ã‘â‚¬ÃÂ¾ÃÂ»Ã‘Å’",
        permissionsLabel: "ÃÅ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ ÃÂ¸ÃÂ¾ÃÂ½ÃÂ½Ã‘â€¹ÃÂµ Ã‘â‚¬ÃÂ°ÃÂ·Ã‘â‚¬ÃÂµÃ‘Ë†ÃÂµÃÂ½ÃÂ¸Ã‘Â",
        savePermissions: "ÃÂ¡ÃÂ¾Ã‘â€¦Ã‘â‚¬ÃÂ°ÃÂ½ÃÂ¸Ã‘â€šÃ‘Å’ Ã‘â‚¬ÃÂ°ÃÂ·Ã‘â‚¬ÃÂµÃ‘Ë†ÃÂµÃÂ½ÃÂ¸Ã‘Â",
        removeMemberLabel: "ÃÂ£ÃÂ´ÃÂ°ÃÂ»ÃÂ¸Ã‘â€šÃ‘Å’ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ°",
        confirmRemove: "Ãâ€™Ã‘â€¹ Ã‘Æ’ÃÂ²ÃÂµÃ‘â‚¬ÃÂµÃÂ½Ã‘â€¹? ÃÂ­Ã‘â€šÃÂ¾ ÃÂ´ÃÂµÃÂ¹Ã‘ÂÃ‘â€šÃÂ²ÃÂ¸ÃÂµ ÃÂ½ÃÂµÃÂ¾ÃÂ±Ã‘â‚¬ÃÂ°Ã‘â€šÃÂ¸ÃÂ¼ÃÂ¾.",
        confirmYes: "Ãâ€ÃÂ°, Ã‘Æ’ÃÂ´ÃÂ°ÃÂ»ÃÂ¸Ã‘â€šÃ‘Å’",
        cancelConfirm: "ÃÅ¾Ã‘â€šÃÂ¼ÃÂµÃÂ½ÃÂ°",
        youBadge: "Ãâ€™Ã‘â€¹",
        creatorBadge: "ÃÂ¡ÃÂ¾ÃÂ·ÃÂ´ÃÂ°Ã‘â€šÃÂµÃÂ»Ã‘Å’",
        lastManagerNote: "Ãâ€¢ÃÂ´ÃÂ¸ÃÂ½Ã‘ÂÃ‘â€šÃÂ²ÃÂµÃÂ½ÃÂ½Ã‘â€¹ÃÂ¹ Manager Ã¢â‚¬â€ ÃÂ½ÃÂµÃÂ»Ã‘Å’ÃÂ·Ã‘Â ÃÂ¿ÃÂ¾ÃÂ½ÃÂ¸ÃÂ·ÃÂ¸Ã‘â€šÃ‘Å’.",
        roleManager: "ÃÅ“ÃÂµÃÂ½ÃÂµÃÂ´ÃÂ¶ÃÂµÃ‘â‚¬",
        roleMember: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂº",
        roleViewer: "ÃÂÃÂ°ÃÂ±ÃÂ»Ã‘Å½ÃÂ´ÃÂ°Ã‘â€šÃÂµÃÂ»Ã‘Å’",
        perm_canCreateTrades: "Ãâ€™ÃÂ½ÃÂ¾Ã‘ÂÃÂ¸Ã‘â€šÃ‘Å’ Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂºÃÂ¸",
        perm_canEditTrades: "ÃÂ ÃÂµÃÂ´ÃÂ°ÃÂºÃ‘â€šÃÂ¸Ã‘â‚¬ÃÂ¾ÃÂ²ÃÂ°Ã‘â€šÃ‘Å’ Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂºÃÂ¸",
        perm_canDeleteTrades: "ÃÂ£ÃÂ´ÃÂ°ÃÂ»Ã‘ÂÃ‘â€šÃ‘Å’ Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂºÃÂ¸",
        perm_canViewAnalytics: "ÃÂÃÂ½ÃÂ°ÃÂ»ÃÂ¸Ã‘â€šÃÂ¸ÃÂºÃÂ°",
        perm_canViewReports: "ÃÅ¾Ã‘â€šÃ‘â€¡Ã‘â€˜Ã‘â€šÃ‘â€¹",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "ÃÅ¸Ã‘â‚¬ÃÂ¾Ã‘ÂÃÂ¼ÃÂ°Ã‘â€šÃ‘â‚¬ÃÂ¸ÃÂ²ÃÂ°Ã‘â€šÃ‘Å’ ÃÂºÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´Ã‘Æ’",
    },
    es: {
        never: "Nunca",
        accountMembers: "Miembros de la cuenta",
        membersActivity: "Actividad de miembros",
        description:
            "Monitoriza presencia, actividad y contribuciÃƒÂ³n operativa de los miembros dentro de esta cuenta compartida.",
        members: "Miembros",
        onlineNow: "Online ahora",
        activeToday: "Activos hoy",
        totalTrades: "Trades totales",
        lastTrade: "ÃƒÅ¡ltimo trade",
        noTrades: "Sin trades",
        latestTradeDescription: "ÃƒÅ¡ltimo trade en esta cuenta.",
        mostActive: "MÃƒÂ¡s activo",
        basedOnInsertedTrades: "Basado en los trades insertados.",
        livePresence: "Presencia en vivo",
        activeLastFiveMinutes: "Activos en los ÃƒÂºltimos 5 minutos.",
        accountStatus: "Estado de cuenta",
        live: "Live",
        quiet: "Silencioso",
        presenceSnapshot: "Snapshot de presencia y actividad.",
        leaderboard: "ClasificaciÃƒÂ³n",
        mostActiveMembers: "Miembros mÃƒÂ¡s activos",
        topFive: "Top 5",
        trades: "trades",
        onlineMembers: "Miembros online",
        activeNow: "Activo ahora",
        noOnlineMembers: "No hay miembros online ahora.",
        memberOverview: "Resumen de miembros",
        accountTeam: "Equipo de cuenta",
        activityProfile:
            "Perfil de actividad basado en presencia, ÃƒÂºltima actividad y contribuciÃƒÂ³n de trades dentro de esta cuenta.",
        lastActivity: "ÃƒÅ¡ltima actividad",
        lastLogin: "ÃƒÅ¡ltimo login",
        viewMemberTrades: "Ver trades del miembro",
        memberAnalytics: "Analytics del miembro",
        openWorkspace: "Abrir workspace",
        backToAccount: "Volver a la cuenta",
        onlineStatus: "Online ahora",
        activeTodayStatus: "Activo hoy",
        activeThisWeekStatus: "Activo esta semana",
        inactiveStatus: "Inactivo",
        notAvailable: "N/D",
        teamManagementSection: "GestiÃƒÂ³n del equipo",
        managementSectionLabel: "GestiÃƒÂ³n",
        inviteMemberHeading: "Invitar miembro",
        usernamePlaceholder: "Usuario",
        sendInvite: "Enviar invitaciÃƒÂ³n",
        pendingInvitesHeading: "Invitaciones pendientes",
        noPendingInvites: "Sin invitaciones pendientes.",
        cancelInvite: "Cancelar invitaciÃƒÂ³n",
        invitedAs: "Invitado como",
        changeRoleLabel: "Cambiar rol",
        saveRole: "Guardar rol",
        permissionsLabel: "Permisos operativos",
        savePermissions: "Guardar permisos",
        removeMemberLabel: "Eliminar miembro",
        confirmRemove: "Ã‚Â¿EstÃƒÂ¡s seguro? Esta acciÃƒÂ³n es irreversible.",
        confirmYes: "SÃƒÂ­, eliminar",
        cancelConfirm: "Cancelar",
        youBadge: "TÃƒÂº",
        creatorBadge: "Creador",
        lastManagerNote: "ÃƒÅ¡nico Manager Ã¢â‚¬â€ no se puede degradar.",
        roleManager: "Manager",
        roleMember: "Miembro",
        roleViewer: "Observador",
        perm_canCreateTrades: "Crear trades",
        perm_canEditTrades: "Editar trades",
        perm_canDeleteTrades: "Eliminar trades",
        perm_canViewAnalytics: "Analytics",
        perm_canViewReports: "Informes",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "Ver equipo",
    },
    fr: {
        never: "Jamais",
        accountMembers: "Membres du compte",
        membersActivity: "ActivitÃƒÂ© des membres",
        description:
            "Surveille la prÃƒÂ©sence, l'activitÃƒÂ© et la contribution opÃƒÂ©rationnelle des membres dans ce compte partagÃƒÂ©.",
        members: "Membres",
        onlineNow: "En ligne maintenant",
        activeToday: "Actifs aujourd'hui",
        totalTrades: "Trades totaux",
        lastTrade: "Dernier trade",
        noTrades: "Aucun trade",
        latestTradeDescription: "Dernier trade enregistrÃƒÂ© dans ce compte.",
        mostActive: "Le plus actif",
        basedOnInsertedTrades: "BasÃƒÂ© sur les trades saisis.",
        livePresence: "PrÃƒÂ©sence en direct",
        activeLastFiveMinutes: "Actifs au cours des 5 derniÃƒÂ¨res minutes.",
        accountStatus: "Statut du compte",
        live: "Live",
        quiet: "Calme",
        presenceSnapshot: "Snapshot de prÃƒÂ©sence et d'activitÃƒÂ©.",
        leaderboard: "Classement",
        mostActiveMembers: "Membres les plus actifs",
        topFive: "Top 5",
        trades: "trades",
        onlineMembers: "Membres en ligne",
        activeNow: "Actif maintenant",
        noOnlineMembers: "Aucun membre en ligne maintenant.",
        memberOverview: "Vue d'ensemble des membres",
        accountTeam: "Ãƒâ€°quipe du compte",
        activityProfile:
            "Profil d'activitÃƒÂ© basÃƒÂ© sur la prÃƒÂ©sence, la derniÃƒÂ¨re activitÃƒÂ© et la contribution trading dans ce compte.",
        lastActivity: "DerniÃƒÂ¨re activitÃƒÂ©",
        lastLogin: "DerniÃƒÂ¨re connexion",
        viewMemberTrades: "Voir les trades du membre",
        memberAnalytics: "Analytics du membre",
        openWorkspace: "Ouvrir le workspace",
        backToAccount: "Retour au compte",
        onlineStatus: "En ligne maintenant",
        activeTodayStatus: "Actif aujourd'hui",
        activeThisWeekStatus: "Actif cette semaine",
        inactiveStatus: "Inactif",
        notAvailable: "N/D",
        teamManagementSection: "Gestion de l'ÃƒÂ©quipe",
        managementSectionLabel: "Gestion",
        inviteMemberHeading: "Inviter un membre",
        usernamePlaceholder: "Nom d'utilisateur",
        sendInvite: "Envoyer l'invitation",
        pendingInvitesHeading: "Invitations en attente",
        noPendingInvites: "Aucune invitation en attente.",
        cancelInvite: "Annuler l'invitation",
        invitedAs: "InvitÃƒÂ© comme",
        changeRoleLabel: "Changer le rÃƒÂ´le",
        saveRole: "Enregistrer le rÃƒÂ´le",
        permissionsLabel: "Permissions opÃƒÂ©rationnelles",
        savePermissions: "Enregistrer les permissions",
        removeMemberLabel: "Supprimer le membre",
        confirmRemove: "ÃƒÅ tes-vous sÃƒÂ»r ? Cette action est irrÃƒÂ©versible.",
        confirmYes: "Oui, supprimer",
        cancelConfirm: "Annuler",
        youBadge: "Vous",
        creatorBadge: "CrÃƒÂ©ateur",
        lastManagerNote: "Seul Manager Ã¢â‚¬â€ impossible de rÃƒÂ©trograder.",
        roleManager: "Manager",
        roleMember: "Membre",
        roleViewer: "Observateur",
        perm_canCreateTrades: "CrÃƒÂ©er des trades",
        perm_canEditTrades: "Modifier des trades",
        perm_canDeleteTrades: "Supprimer des trades",
        perm_canViewAnalytics: "Analytics",
        perm_canViewReports: "Rapports",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "Voir l'ÃƒÂ©quipe",
    },
    de: {
        never: "Nie",
        accountMembers: "Kontomitglieder",
        membersActivity: "MitgliederaktivitÃƒÂ¤t",
        description:
            "ÃƒÅ“berwache PrÃƒÂ¤senz, AktivitÃƒÂ¤t und operativen Beitrag der Mitglieder in diesem gemeinsamen Konto.",
        members: "Mitglieder",
        onlineNow: "Jetzt online",
        activeToday: "Heute aktiv",
        totalTrades: "Gesamte Trades",
        lastTrade: "Letzter Trade",
        noTrades: "Keine Trades",
        latestTradeDescription: "Letzter Trade in diesem Konto.",
        mostActive: "Aktivstes Mitglied",
        basedOnInsertedTrades: "Basierend auf eingetragenen Trades.",
        livePresence: "Live-PrÃƒÂ¤senz",
        activeLastFiveMinutes: "Aktiv in den letzten 5 Minuten.",
        accountStatus: "Kontostatus",
        live: "Live",
        quiet: "Ruhig",
        presenceSnapshot: "Snapshot von PrÃƒÂ¤senz und AktivitÃƒÂ¤t.",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Aktivste Mitglieder",
        topFive: "Top 5",
        trades: "Trades",
        onlineMembers: "Online-Mitglieder",
        activeNow: "Jetzt aktiv",
        noOnlineMembers: "Derzeit keine Mitglieder online.",
        memberOverview: "MitgliederÃƒÂ¼bersicht",
        accountTeam: "Kontoteam",
        activityProfile:
            "AktivitÃƒÂ¤tsprofil basierend auf Login-PrÃƒÂ¤senz, letzter AktivitÃƒÂ¤t und Trade-Beitrag in diesem Konto.",
        lastActivity: "Letzte AktivitÃƒÂ¤t",
        lastLogin: "Letzter Login",
        viewMemberTrades: "Trades des Mitglieds ansehen",
        memberAnalytics: "Mitglieder-Analytics",
        openWorkspace: "Workspace ÃƒÂ¶ffnen",
        backToAccount: "ZurÃƒÂ¼ck zum Konto",
        onlineStatus: "Jetzt online",
        activeTodayStatus: "Heute aktiv",
        activeThisWeekStatus: "Diese Woche aktiv",
        inactiveStatus: "Inaktiv",
        notAvailable: "N/A",
        teamManagementSection: "Team-Verwaltung",
        managementSectionLabel: "Verwaltung",
        inviteMemberHeading: "Mitglied einladen",
        usernamePlaceholder: "Benutzername",
        sendInvite: "Einladung senden",
        pendingInvitesHeading: "Ausstehende Einladungen",
        noPendingInvites: "Keine ausstehenden Einladungen.",
        cancelInvite: "Einladung stornieren",
        invitedAs: "Eingeladen als",
        changeRoleLabel: "Rolle ÃƒÂ¤ndern",
        saveRole: "Rolle speichern",
        permissionsLabel: "Betriebsberechtigungen",
        savePermissions: "Berechtigungen speichern",
        removeMemberLabel: "Mitglied entfernen",
        confirmRemove: "Bist du sicher? Diese Aktion kann nicht rÃƒÂ¼ckgÃƒÂ¤ngig gemacht werden.",
        confirmYes: "Ja, entfernen",
        cancelConfirm: "Abbrechen",
        youBadge: "Du",
        creatorBadge: "Ersteller",
        lastManagerNote: "Einziger Manager Ã¢â‚¬â€ kann nicht heruntergestuft werden.",
        roleManager: "Manager",
        roleMember: "Mitglied",
        roleViewer: "Beobachter",
        perm_canCreateTrades: "Trades erstellen",
        perm_canEditTrades: "Trades bearbeiten",
        perm_canDeleteTrades: "Trades lÃƒÂ¶schen",
        perm_canViewAnalytics: "Analytics",
        perm_canViewReports: "Berichte",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "Team ansehen",
    },
};

function formatDateTime(
    date: Date | null,
    language: AppLanguage,
    t: MembersLabels
) {
    if (!date) return t.never;

    return new Date(date).toLocaleString(getLocaleFromLanguage(language), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(
    date: Date | null,
    language: AppLanguage,
    t: MembersLabels
) {
    if (!date) return t.never;

    return new Date(date).toLocaleDateString(getLocaleFromLanguage(language), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function getActivityStatus(
    lastActivityAt: Date | null,
    t: MembersLabels
) {
    if (!lastActivityAt) {
        return {
            label: t.inactiveStatus,
            color: "bg-red-500/10 text-red-300 border-red-500/20",
            dot: "bg-red-400",
        };
    }

    const now = new Date().getTime();
    const diff = now - new Date(lastActivityAt).getTime();
    const minutes = diff / (1000 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (minutes <= 5) {
        return {
            label: t.onlineStatus,
            color: "bg-accent/10 text-green-300 border-accent/20",
            dot: "bg-accent",
        };
    }

    if (days < 1) {
        return {
            label: t.activeTodayStatus,
            color: "bg-accent-bright/10 text-accent-bright border-accent-bright/20",
            dot: "bg-accent-bright",
        };
    }

    if (days < 7) {
        return {
            label: t.activeThisWeekStatus,
            color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
            dot: "bg-yellow-400",
        };
    }

    return {
        label: t.inactiveStatus,
        color: "bg-red-500/10 text-red-300 border-red-500/20",
        dot: "bg-red-400",
    };
}

function isOnline(lastActivityAt: Date | null) {
    if (!lastActivityAt) return false;

    const now = new Date().getTime();
    const diff = now - new Date(lastActivityAt).getTime();

    return diff <= 1000 * 60 * 5;
}

function getRoleTone(role: string) {
    if (role === "MANAGER") {
        return "border-accent/20 bg-accent/10 text-green-300";
    }

    if (role === "MEMBER") {
        return "border-accent-bright/20 bg-accent-bright/10 text-accent-bright";
    }

    if (role === "VIEWER") {
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }

    return "border-white/10 bg-white/[0.03] text-gray-300";
}

export default async function MembersPage({
    params,
}: {
    params: Promise<{
        accountId: string;
    }>;
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
            tradingAccount: true,
            user: true,
        },
    });

    if (!membership) {
        redirect("/accounts");
    }

    if (membership.role !== "MANAGER" && !membership.canViewMembers) {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    const language = normalizeAppLanguage(membership.user.appLanguage);
    const t = labels[language] ?? labels.en;

    const currentUserId = membership.userId;
    const accountCreatorId = membership.tradingAccount.createdById ?? "";

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            lastSeenAt: new Date(),
            lastActivityAt: new Date(),
        },
    });

    const members = await prisma.accountMember.findMany({
        where: {
            tradingAccountId: accountId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    role: true,
                    lastSeenAt: true,
                    lastLoginAt: true,
                    lastActivityAt: true,
                    loginCount: true,
                },
            },
        },
        orderBy: [
            {
                role: "asc",
            },
            {
                createdAt: "asc",
            },
        ],
    });

    const managerCount = members.filter((m) => m.role === "MANAGER").length;

    const pendingInvites = membership.canManageMembers
        ? await prisma.accountInvite.findMany({
              where: { tradingAccountId: accountId },
              include: {
                  invitedUser: { select: { username: true, name: true } },
              },
              orderBy: { createdAt: "desc" },
          })
        : [];

    const membersWithStats = await Promise.all(
        members.map(async (member) => {
            const lastTrade = await prisma.trade.findFirst({
                where: {
                    tradingAccountId: accountId,
                    createdById: member.userId,
                },
                orderBy: [
                    {
                        openDate: "desc",
                    },
                    {
                        openTime: "desc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
            });

            const totalTrades = await prisma.trade.count({
                where: {
                    tradingAccountId: accountId,
                    createdById: member.userId,
                },
            });

            return {
                ...member,
                lastTrade,
                totalTrades,
            };
        })
    );

    const totalAccountTrades = await prisma.trade.count({
        where: {
            tradingAccountId: accountId,
        },
    });

    const lastAccountTrade = await prisma.trade.findFirst({
        where: {
            tradingAccountId: accountId,
        },
        orderBy: [
            {
                openDate: "desc",
            },
            {
                openTime: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    const sortedByActivity = membersWithStats
        .slice()
        .sort((a, b) => b.totalTrades - a.totalTrades);

    const mostActiveMember = sortedByActivity[0];

    const onlineMembers = membersWithStats.filter((member) =>
        isOnline(member.user.lastActivityAt)
    );

    const activeToday = membersWithStats.filter((member) => {
        if (!member.user.lastActivityAt) return false;

        const diff =
            new Date().getTime() -
            new Date(member.user.lastActivityAt).getTime();

        return diff <= 1000 * 60 * 60 * 24;
    });

    return (
        <div className="space-y-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-8 md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-accent-bright)_12%,transparent),transparent_35%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_30%)]" />

                <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-accent-bright/20 bg-accent-bright/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-bright">
                            <Users size={14} />
                            {t.accountMembers}
                        </div>

                        <h1 className="mt-6 text-4xl font-black text-white md:text-6xl">
                            {t.membersActivity}
                        </h1>

                        <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
                            {t.description}
                        </p>
                    </div>

                    <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[460px]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">{t.members}</p>
                            <p className="mt-3 text-3xl font-black text-white">
                                {members.length}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
                            <p className="text-sm text-gray-400">{t.onlineNow}</p>
                            <p className="mt-3 text-3xl font-black text-accent">
                                {onlineMembers.length}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-accent-bright/20 bg-accent-bright/10 p-5">
                            <p className="text-sm text-gray-400">{t.activeToday}</p>
                            <p className="mt-3 text-3xl font-black text-accent-bright">
                                {activeToday.length}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5">
                            <p className="text-sm text-gray-400">{t.totalTrades}</p>
                            <p className="mt-3 text-3xl font-black text-yellow-300">
                                {totalAccountTrades}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Management Ã¢â‚¬â€ only for canManageMembers */}
            {membership.canManageMembers && (
                <section className="space-y-5">
                    <div>
                        <p className="text-sm text-gray-400">{t.managementSectionLabel}</p>
                        <h2 className="mt-1 flex items-center gap-3 text-3xl font-black text-white">
                            <UserPlus size={28} className="text-accent-bright" />
                            {t.teamManagementSection}
                        </h2>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        {/* Invite form */}
                        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7">
                            <p className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-gray-400">
                                {t.inviteMemberHeading}
                            </p>
                            <InviteMemberForm
                                accountId={accountId}
                                canManageRoles={membership.canManageRoles}
                                t={{
                                    usernamePlaceholder: t.usernamePlaceholder,
                                    sendInvite: t.sendInvite,
                                    roleManager: t.roleManager,
                                    roleMember: t.roleMember,
                                    roleViewer: t.roleViewer,
                                }}
                            />
                        </div>

                        {/* Pending invites */}
                        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <p className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400">
                                    {t.pendingInvitesHeading}
                                </p>
                                {pendingInvites.length > 0 && (
                                    <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-300">
                                        {pendingInvites.length}
                                    </div>
                                )}
                            </div>

                            {pendingInvites.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-500">
                                    {t.noPendingInvites}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingInvites.map((invite) => (
                                        <div
                                            key={invite.id}
                                            className="flex items-center justify-between gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-white">
                                                    {invite.invitedUser.name ??
                                                        invite.invitedUser.username}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {t.invitedAs} Ã‚Â· {invite.role}
                                                </p>
                                            </div>
                                            <CancelInviteButton
                                                accountId={accountId}
                                                inviteId={invite.id}
                                                label={t.cancelInvite}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Quick stats */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.lastTrade}</p>
                    <p className="mt-3 text-2xl font-black text-white">
                        {lastAccountTrade ? lastAccountTrade.symbol : t.noTrades}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        {t.latestTradeDescription}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.mostActive}</p>
                    <p className="mt-3 text-2xl font-black text-white">
                        {mostActiveMember ? mostActiveMember.user.username : t.notAvailable}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        {t.basedOnInsertedTrades}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.livePresence}</p>
                    <p className="mt-3 text-2xl font-black text-accent">
                        {members.length > 0
                            ? `${Math.round((onlineMembers.length / members.length) * 100)}%`
                            : "0%"}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        {t.activeLastFiveMinutes}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.accountStatus}</p>
                    <p className="mt-3 text-2xl font-black text-accent-bright">
                        {onlineMembers.length > 0 ? t.live : t.quiet}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        {t.presenceSnapshot}
                    </p>
                </div>
            </section>

            {/* Leaderboard + Online */}
            <section className="grid items-stretch gap-6 xl:grid-cols-2">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">{t.leaderboard}</p>
                            <h2 className="mt-1 text-3xl font-black text-white">
                                {t.mostActiveMembers}
                            </h2>
                        </div>

                        <div className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-300">
                            {t.topFive}
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        {sortedByActivity.slice(0, 5).map((member, index) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-lg font-black text-accent">
                                        #{index + 1}
                                    </div>

                                    <div>
                                        <p className="text-lg font-black text-white">
                                            {member.user.username}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-black text-white">
                                        {member.totalTrades}
                                    </p>
                                    <p className="text-xs text-gray-500">{t.trades}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">{t.livePresence}</p>
                            <h2 className="mt-1 text-3xl font-black text-white">
                                {t.onlineMembers}
                            </h2>
                        </div>

                        <div className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-300">
                            {onlineMembers.length} {t.onlineNow}
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        {onlineMembers.length > 0 ? (
                            onlineMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-accent/20 bg-accent/10 p-4"
                                >
                                    <div>
                                        <p className="text-lg font-black text-white">
                                            {member.user.username}
                                        </p>
                                        <p className="mt-1 text-xs text-green-300">
                                            {t.activeNow}
                                        </p>
                                    </div>

                                    <Radio className="text-accent" />
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                {t.noOnlineMembers}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Account Team */}
            <section className="space-y-5">
                <div>
                    <p className="text-sm text-gray-400">{t.memberOverview}</p>
                    <h2 className="mt-1 text-3xl font-black text-white">
                        {t.accountTeam}
                    </h2>
                </div>

                <div className="grid gap-6">
                    {membersWithStats.map((member) => {
                        const activity = getActivityStatus(member.user.lastActivityAt, t);
                        const isMe = member.userId === currentUserId;
                        const isCreator = member.userId === accountCreatorId;
                        const isLastManager =
                            member.role === "MANAGER" && managerCount === 1;
                        const canManageThisMember =
                            !isMe &&
                            (membership.canManageMembers || membership.canManageRoles);

                        return (
                            <div
                                key={member.id}
                                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7"
                            >
                                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-3xl font-black text-white">
                                                {member.user.username}
                                            </h3>

                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${activity.color}`}
                                            >
                                                <span className={`h-2 w-2 rounded-full ${activity.dot}`} />
                                                {activity.label}
                                            </div>

                                            <div
                                                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${getRoleTone(
                                                    member.role
                                                )}`}
                                            >
                                                {member.role}
                                            </div>

                                            {isMe && (
                                                <div className="rounded-full border border-accent-bright/30 bg-accent-bright/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-accent-bright">
                                                    {t.youBadge}
                                                </div>
                                            )}

                                            {isCreator && (
                                                <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-purple-300">
                                                    {t.creatorBadge}
                                                </div>
                                            )}
                                        </div>

                                        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
                                            {t.activityProfile}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-accent-bright/20 bg-accent-bright/10 px-5 py-3 text-sm font-black uppercase tracking-[0.15em] text-accent-bright">
                                        {member.totalTrades} {t.trades}
                                    </div>
                                </div>

                                <div className="mt-7 grid gap-4 md:grid-cols-3">
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <div className="flex items-center gap-3">
                                            <Clock3 size={18} className="text-accent-bright" />
                                            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                                {t.lastActivity}
                                            </p>
                                        </div>
                                        <p className="mt-4 text-lg font-black text-white">
                                            {formatDateTime(
                                                member.user.lastActivityAt || member.user.lastSeenAt,
                                                language,
                                                t
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <div className="flex items-center gap-3">
                                            <Clock3 size={18} className="text-accent-bright" />
                                            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                                {t.lastLogin}
                                            </p>
                                        </div>
                                        <p className="mt-4 text-lg font-black text-white">
                                            {formatDateTime(member.user.lastLoginAt, language, t)}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <div className="flex items-center gap-3">
                                            <Activity size={18} className="text-accent-bright" />
                                            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                                {t.lastTrade}
                                            </p>
                                        </div>
                                        <p className="mt-4 text-lg font-black text-white">
                                            {member.lastTrade
                                                ? `${member.lastTrade.symbol} Ã‚Â· ${formatDate(
                                                    member.lastTrade.openDate,
                                                    language,
                                                    t
                                                )}`
                                                : t.noTrades}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={`/accounts/${accountId}/diary?member=${member.userId}`}
                                        className="rounded-2xl border border-accent-bright/20 bg-accent-bright/10 px-5 py-3 text-sm font-bold text-accent-bright transition hover:bg-accent-bright/20"
                                    >
                                        {t.viewMemberTrades}
                                    </Link>

                                    <Link
                                        href={`/accounts/${accountId}/members/${member.userId}`}
                                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06]"
                                    >
                                        {t.memberAnalytics}
                                    </Link>

                                    <Link
                                        href={`/accounts/${accountId}/workspace`}
                                        className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
                                    >
                                        {t.openWorkspace}
                                    </Link>
                                </div>

                                {/* Per-member management Ã¢â‚¬â€ hidden on own card */}
                                {canManageThisMember && (
                                    <MemberManagementActions
                                        key={`${member.userId}-${member.role}-${[
                                            member.canCreateTrades,
                                            member.canEditTrades,
                                            member.canDeleteTrades,
                                            member.canViewAnalytics,
                                            member.canViewReports,
                                            member.canViewCopilot,
                                            member.canViewMembers,
                                        ]
                                            .map((v) => (v ? "1" : "0"))
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
                                        isCreator={isCreator}
                                        isLastManager={isLastManager}
                                        t={{
                                            changeRoleLabel: t.changeRoleLabel,
                                            saveRole: t.saveRole,
                                            permissionsLabel: t.permissionsLabel,
                                            savePermissions: t.savePermissions,
                                            removeMemberLabel: t.removeMemberLabel,
                                            confirmRemove: t.confirmRemove,
                                            confirmYes: t.confirmYes,
                                            cancelConfirm: t.cancelConfirm,
                                            lastManagerNote: t.lastManagerNote,
                                            roleManager: t.roleManager,
                                            roleMember: t.roleMember,
                                            roleViewer: t.roleViewer,
                                            perm_canCreateTrades: t.perm_canCreateTrades,
                                            perm_canEditTrades: t.perm_canEditTrades,
                                            perm_canDeleteTrades: t.perm_canDeleteTrades,
                                            perm_canViewAnalytics: t.perm_canViewAnalytics,
                                            perm_canViewReports: t.perm_canViewReports,
                                            perm_canViewCopilot: t.perm_canViewCopilot,
                                            perm_canViewMembers: t.perm_canViewMembers,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <div>
                <Link
                    href={`/accounts/${accountId}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06]"
                >
                    <ArrowLeft size={16} />
                    {t.backToAccount}
                </Link>
            </div>
        </div>
    );
}
