import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    normalizeAppLanguage,
    getLocaleFromLanguage,
    type AppLanguage,
} from "@/lib/i18n";

type WorkspaceLabels = {
    never: string;
    workspaceIntelligence: string;
    description: string;
    manageMembers: string;
    viewActivity: string;
    workspaceStatus: string;
    activeToday: string;
    livePresence: string;
    members: string;
    onlineNow: string;
    recentEvents: string;
    totalMembersDescription: string;
    onlineDescription: string;
    activeTodayDescription: string;
    recentEventsDescription: string;
    leaderboard: string;
    mostActiveMembers: string;
    topFive: string;
    logins: string;
    noMembers: string;
    onlineMembers: string;
    lastActivity: string;
    online: string;
    noOnlineMembers: string;
    attention: string;
    inactiveMembers: string;
    offline: string;
    allMembersActive: string;
    audit: string;
    recentActivity: string;
    viewAll: string;
    noRecentActivity: string;
    waitingForMembers: string;
    fullyActiveToday: string;
    liveActivityDetected: string;
    activityRecordedToday: string;
    quietWorkspace: string;
};

const labels: Record<AppLanguage, WorkspaceLabels> = {
    it: {
        never: "Mai",
        workspaceIntelligence: "Workspace Intelligence",
        description:
            "Monitoraggio del team, attivitÃƒÂ  recenti, membri online e utilizzo reale del workspace.",
        manageMembers: "Gestisci membri",
        viewActivity: "Vedi attivitÃƒÂ ",
        workspaceStatus: "Stato workspace",
        activeToday: "Attivi oggi",
        livePresence: "Presenza live",
        members: "Membri",
        onlineNow: "Online ora",
        recentEvents: "Eventi recenti",
        totalMembersDescription: "Membri totali dentro questo account.",
        onlineDescription: "Attivi negli ultimi 5 minuti.",
        activeTodayDescription: "Membri con attivitÃƒÂ  registrata oggi.",
        recentEventsDescription: "Ultimi record attivitÃƒÂ  caricati.",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Membri piÃƒÂ¹ attivi",
        topFive: "Top 5",
        logins: "accessi",
        noMembers: "Nessun membro disponibile.",
        onlineMembers: "Membri online",
        lastActivity: "Ultima attivitÃƒÂ ",
        online: "Online",
        noOnlineMembers: "Nessun membro online ora.",
        attention: "Attenzione",
        inactiveMembers: "Membri inattivi",
        offline: "Offline",
        allMembersActive: "Tutti i membri risultano attivi.",
        audit: "Audit",
        recentActivity: "AttivitÃƒÂ  recente",
        viewAll: "Vedi tutto",
        noRecentActivity: "Nessuna attivitÃƒÂ  recente.",
        waitingForMembers: "In attesa di membri",
        fullyActiveToday: "Tutti attivi oggi",
        liveActivityDetected: "AttivitÃƒÂ  live rilevata",
        activityRecordedToday: "AttivitÃƒÂ  registrata oggi",
        quietWorkspace: "Workspace silenzioso",
    },
    en: {
        never: "Never",
        workspaceIntelligence: "Workspace Intelligence",
        description:
            "Team monitoring, recent activity, online members and real workspace usage.",
        manageMembers: "Manage Members",
        viewActivity: "View Activity",
        workspaceStatus: "Workspace Status",
        activeToday: "Active Today",
        livePresence: "Live Presence",
        members: "Members",
        onlineNow: "Online Now",
        recentEvents: "Recent Events",
        totalMembersDescription: "Total members inside this account.",
        onlineDescription: "Active in the last 5 minutes.",
        activeTodayDescription: "Members with activity today.",
        recentEventsDescription: "Latest activity records loaded.",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Most Active Members",
        topFive: "Top 5",
        logins: "logins",
        noMembers: "No members available.",
        onlineMembers: "Online Members",
        lastActivity: "Last activity",
        online: "Online",
        noOnlineMembers: "No members online now.",
        attention: "Attention",
        inactiveMembers: "Inactive Members",
        offline: "Offline",
        allMembersActive: "All members appear active.",
        audit: "Audit",
        recentActivity: "Recent Activity",
        viewAll: "View all",
        noRecentActivity: "No recent activity.",
        waitingForMembers: "Waiting for members",
        fullyActiveToday: "Fully active today",
        liveActivityDetected: "Live activity detected",
        activityRecordedToday: "Activity recorded today",
        quietWorkspace: "Quiet workspace",
    },
    uk: {
        never: "ÃÂÃ‘â€“ÃÂºÃÂ¾ÃÂ»ÃÂ¸",
        workspaceIntelligence: "Ãâ€ ÃÂ½Ã‘â€šÃÂµÃÂ»ÃÂµÃÂºÃ‘â€š Ã‘â‚¬ÃÂ¾ÃÂ±ÃÂ¾Ã‘â€¡ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¾Ã‘â‚¬Ã‘Æ’",
        description:
            "ÃÅ“ÃÂ¾ÃÂ½Ã‘â€“Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ¸ÃÂ½ÃÂ³ ÃÂºÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´ÃÂ¸, ÃÂ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Å’ÃÂ¾Ã‘â€” ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“, ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½-Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ² Ã‘â€“ Ã‘â‚¬ÃÂµÃÂ°ÃÂ»Ã‘Å’ÃÂ½ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ²ÃÂ¸ÃÂºÃÂ¾Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Â workspace.",
        manageMembers: "ÃÅ¡ÃÂµÃ‘â‚¬Ã‘Æ’ÃÂ²ÃÂ°Ã‘â€šÃÂ¸ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ°ÃÂ¼ÃÂ¸",
        viewActivity: "ÃÅ¸ÃÂµÃ‘â‚¬ÃÂµÃÂ³ÃÂ»Ã‘ÂÃÂ½Ã‘Æ’Ã‘â€šÃÂ¸ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’",
        workspaceStatus: "ÃÂ¡Ã‘â€šÃÂ°Ã‘â€šÃ‘Æ’Ã‘Â workspace",
        activeToday: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“ Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘â€“",
        livePresence: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½-ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’",
        members: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        onlineNow: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½ ÃÂ·ÃÂ°Ã‘â‚¬ÃÂ°ÃÂ·",
        recentEvents: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘â€“ ÃÂ¿ÃÂ¾ÃÂ´Ã‘â€“Ã‘â€”",
        totalMembersDescription: "Ãâ€”ÃÂ°ÃÂ³ÃÂ°ÃÂ»Ã‘Å’ÃÂ½ÃÂ° ÃÂºÃ‘â€“ÃÂ»Ã‘Å’ÃÂºÃ‘â€“Ã‘ÂÃ‘â€šÃ‘Å’ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ² Ã‘Æ’ Ã‘â€ Ã‘Å’ÃÂ¾ÃÂ¼Ã‘Æ’ ÃÂ°ÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃ‘â€“.",
        onlineDescription: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“ ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘â€šÃ‘ÂÃÂ³ÃÂ¾ÃÂ¼ ÃÂ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘â€“Ã‘â€¦ 5 Ã‘â€¦ÃÂ²ÃÂ¸ÃÂ»ÃÂ¸ÃÂ½.",
        activeTodayDescription: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ· ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å½ Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘â€“.",
        recentEventsDescription: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘â€“ ÃÂ·ÃÂ°ÃÂ²ÃÂ°ÃÂ½Ã‘â€šÃÂ°ÃÂ¶ÃÂµÃÂ½Ã‘â€“ ÃÂ·ÃÂ°ÃÂ¿ÃÂ¸Ã‘ÂÃÂ¸ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“.",
        leaderboard: "ÃÂ ÃÂµÃÂ¹Ã‘â€šÃÂ¸ÃÂ½ÃÂ³",
        mostActiveMembers: "ÃÂÃÂ°ÃÂ¹ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘Ë†Ã‘â€“ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        topFive: "ÃÂ¢ÃÂ¾ÃÂ¿ 5",
        logins: "ÃÂ²Ã‘â€¦ÃÂ¾ÃÂ´ÃÂ¸",
        noMembers: "ÃÂÃÂµÃÂ¼ÃÂ°Ã‘â€ ÃÂ´ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Æ’ÃÂ¿ÃÂ½ÃÂ¸Ã‘â€¦ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ².",
        onlineMembers: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        lastActivity: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Â ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’",
        online: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        noOnlineMembers: "Ãâ€”ÃÂ°Ã‘â‚¬ÃÂ°ÃÂ· ÃÂ½ÃÂµÃÂ¼ÃÂ°Ã‘â€ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ² ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½.",
        attention: "ÃÂ£ÃÂ²ÃÂ°ÃÂ³ÃÂ°",
        inactiveMembers: "ÃÂÃÂµÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        offline: "ÃÅ¾Ã‘â€žÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        allMembersActive: "ÃÂ£Ã‘ÂÃ‘â€“ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ²ÃÂ¸ÃÂ³ÃÂ»Ã‘ÂÃÂ´ÃÂ°Ã‘Å½Ã‘â€šÃ‘Å’ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¸ÃÂ¼ÃÂ¸.",
        audit: "ÃÂÃ‘Æ’ÃÂ´ÃÂ¸Ã‘â€š",
        recentActivity: "ÃÅ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Â ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’",
        viewAll: "ÃÅ¸ÃÂµÃ‘â‚¬ÃÂµÃÂ³ÃÂ»Ã‘ÂÃÂ½Ã‘Æ’Ã‘â€šÃÂ¸ ÃÂ²Ã‘ÂÃÂµ",
        noRecentActivity: "ÃÂÃÂµÃÂ¼ÃÂ°Ã‘â€ ÃÂ¾Ã‘ÂÃ‘â€šÃÂ°ÃÂ½ÃÂ½Ã‘Å’ÃÂ¾Ã‘â€” ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â€“.",
        waitingForMembers: "ÃÅ¾Ã‘â€¡Ã‘â€“ÃÂºÃ‘Æ’ÃÂ²ÃÂ°ÃÂ½ÃÂ½Ã‘Â Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃÂ½ÃÂ¸ÃÂºÃ‘â€“ÃÂ²",
        fullyActiveToday: "ÃÂ£Ã‘ÂÃ‘â€“ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“ Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘â€“",
        liveActivityDetected: "Ãâ€™ÃÂ¸Ã‘ÂÃÂ²ÃÂ»ÃÂµÃÂ½ÃÂ¾ live-ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’",
        activityRecordedToday: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’ ÃÂ·ÃÂ°Ã‘â€žÃ‘â€“ÃÂºÃ‘ÂÃÂ¾ÃÂ²ÃÂ°ÃÂ½ÃÂ° Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘â€“",
        quietWorkspace: "ÃÂ¢ÃÂ¸Ã‘â€¦ÃÂ¸ÃÂ¹ workspace",
    },
    ru: {
        never: "ÃÂÃÂ¸ÃÂºÃÂ¾ÃÂ³ÃÂ´ÃÂ°",
        workspaceIntelligence: "ÃËœÃÂ½Ã‘â€šÃÂµÃÂ»ÃÂ»ÃÂµÃÂºÃ‘â€š Ã‘â‚¬ÃÂ°ÃÂ±ÃÂ¾Ã‘â€¡ÃÂµÃÂ³ÃÂ¾ ÃÂ¿Ã‘â‚¬ÃÂ¾Ã‘ÂÃ‘â€šÃ‘â‚¬ÃÂ°ÃÂ½Ã‘ÂÃ‘â€šÃÂ²ÃÂ°",
        description:
            "ÃÅ“ÃÂ¾ÃÂ½ÃÂ¸Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ¸ÃÂ½ÃÂ³ ÃÂºÃÂ¾ÃÂ¼ÃÂ°ÃÂ½ÃÂ´Ã‘â€¹, ÃÂ¿ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½ÃÂµÃÂ¹ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¸, Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ² ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½ ÃÂ¸ Ã‘â‚¬ÃÂµÃÂ°ÃÂ»Ã‘Å’ÃÂ½ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ¸Ã‘ÂÃÂ¿ÃÂ¾ÃÂ»Ã‘Å’ÃÂ·ÃÂ¾ÃÂ²ÃÂ°ÃÂ½ÃÂ¸Ã‘Â workspace.",
        manageMembers: "ÃÂ£ÃÂ¿Ã‘â‚¬ÃÂ°ÃÂ²ÃÂ»Ã‘ÂÃ‘â€šÃ‘Å’ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ°ÃÂ¼ÃÂ¸",
        viewActivity: "ÃÂ¡ÃÂ¼ÃÂ¾Ã‘â€šÃ‘â‚¬ÃÂµÃ‘â€šÃ‘Å’ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’",
        workspaceStatus: "ÃÂ¡Ã‘â€šÃÂ°Ã‘â€šÃ‘Æ’Ã‘Â workspace",
        activeToday: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ Ã‘ÂÃÂµÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘Â",
        livePresence: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½-ÃÂ¿Ã‘â‚¬ÃÂ¸Ã‘ÂÃ‘Æ’Ã‘â€šÃ‘ÂÃ‘â€šÃÂ²ÃÂ¸ÃÂµ",
        members: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        onlineNow: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½ Ã‘ÂÃÂµÃÂ¹Ã‘â€¡ÃÂ°Ã‘Â",
        recentEvents: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½ÃÂ¸ÃÂµ Ã‘ÂÃÂ¾ÃÂ±Ã‘â€¹Ã‘â€šÃÂ¸Ã‘Â",
        totalMembersDescription: "ÃÅ¾ÃÂ±Ã‘â€°ÃÂµÃÂµ ÃÂºÃÂ¾ÃÂ»ÃÂ¸Ã‘â€¡ÃÂµÃ‘ÂÃ‘â€šÃÂ²ÃÂ¾ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ² ÃÂ² Ã‘ÂÃ‘â€šÃÂ¾ÃÂ¼ ÃÂ°ÃÂºÃÂºÃÂ°Ã‘Æ’ÃÂ½Ã‘â€šÃÂµ.",
        onlineDescription: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ ÃÂ·ÃÂ° ÃÂ¿ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½ÃÂ¸ÃÂµ 5 ÃÂ¼ÃÂ¸ÃÂ½Ã‘Æ’Ã‘â€š.",
        activeTodayDescription: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸ Ã‘Â ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’Ã‘Å½ Ã‘ÂÃÂµÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘Â.",
        recentEventsDescription: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½ÃÂ¸ÃÂµ ÃÂ·ÃÂ°ÃÂ³Ã‘â‚¬Ã‘Æ’ÃÂ¶ÃÂµÃÂ½ÃÂ½Ã‘â€¹ÃÂµ ÃÂ·ÃÂ°ÃÂ¿ÃÂ¸Ã‘ÂÃÂ¸ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¸.",
        leaderboard: "ÃÂ ÃÂµÃÂ¹Ã‘â€šÃÂ¸ÃÂ½ÃÂ³",
        mostActiveMembers: "ÃÂ¡ÃÂ°ÃÂ¼Ã‘â€¹ÃÂµ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ÃÂµ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        topFive: "ÃÂ¢ÃÂ¾ÃÂ¿ 5",
        logins: "ÃÂ²Ã‘â€¦ÃÂ¾ÃÂ´Ã‘â€¹",
        noMembers: "ÃÂÃÂµÃ‘â€š ÃÂ´ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Æ’ÃÂ¿ÃÂ½Ã‘â€¹Ã‘â€¦ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ².",
        onlineMembers: "ÃÂ£Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        lastActivity: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½Ã‘ÂÃ‘Â ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’",
        online: "ÃÅ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        noOnlineMembers: "ÃÂ¡ÃÂµÃÂ¹Ã‘â€¡ÃÂ°Ã‘Â ÃÂ½ÃÂµÃ‘â€š Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ² ÃÂ¾ÃÂ½ÃÂ»ÃÂ°ÃÂ¹ÃÂ½.",
        attention: "Ãâ€™ÃÂ½ÃÂ¸ÃÂ¼ÃÂ°ÃÂ½ÃÂ¸ÃÂµ",
        inactiveMembers: "ÃÂÃÂµÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ÃÂµ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸",
        offline: "ÃÅ¾Ã‘â€žÃÂ»ÃÂ°ÃÂ¹ÃÂ½",
        allMembersActive: "Ãâ€™Ã‘ÂÃÂµ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¸ ÃÂ²Ã‘â€¹ÃÂ³ÃÂ»Ã‘ÂÃÂ´Ã‘ÂÃ‘â€š ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ÃÂ¼ÃÂ¸.",
        audit: "ÃÂÃ‘Æ’ÃÂ´ÃÂ¸Ã‘â€š",
        recentActivity: "ÃÅ¸ÃÂ¾Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ½Ã‘ÂÃ‘Â ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’",
        viewAll: "ÃÂ¡ÃÂ¼ÃÂ¾Ã‘â€šÃ‘â‚¬ÃÂµÃ‘â€šÃ‘Å’ ÃÂ²Ã‘ÂÃÂµ",
        noRecentActivity: "ÃÂÃÂµÃ‘â€š ÃÂ½ÃÂµÃÂ´ÃÂ°ÃÂ²ÃÂ½ÃÂµÃÂ¹ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃÂ¸.",
        waitingForMembers: "ÃÅ¾ÃÂ¶ÃÂ¸ÃÂ´ÃÂ°ÃÂ½ÃÂ¸ÃÂµ Ã‘Æ’Ã‘â€¡ÃÂ°Ã‘ÂÃ‘â€šÃÂ½ÃÂ¸ÃÂºÃÂ¾ÃÂ²",
        fullyActiveToday: "Ãâ€™Ã‘ÂÃÂµ ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½Ã‘â€¹ Ã‘ÂÃÂµÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘Â",
        liveActivityDetected: "ÃÅ¾ÃÂ±ÃÂ½ÃÂ°Ã‘â‚¬Ã‘Æ’ÃÂ¶ÃÂµÃÂ½ÃÂ° live-ÃÂ°ÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’",
        activityRecordedToday: "ÃÂÃÂºÃ‘â€šÃÂ¸ÃÂ²ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’ ÃÂ·ÃÂ°Ã‘â€žÃÂ¸ÃÂºÃ‘ÂÃÂ¸Ã‘â‚¬ÃÂ¾ÃÂ²ÃÂ°ÃÂ½ÃÂ° Ã‘ÂÃÂµÃÂ³ÃÂ¾ÃÂ´ÃÂ½Ã‘Â",
        quietWorkspace: "ÃÂ¢ÃÂ¸Ã‘â€¦ÃÂ¸ÃÂ¹ workspace",
    },
    es: {
        never: "Nunca",
        workspaceIntelligence: "Inteligencia del workspace",
        description:
            "MonitorizaciÃƒÂ³n del equipo, actividad reciente, miembros online y uso real del workspace.",
        manageMembers: "Gestionar miembros",
        viewActivity: "Ver actividad",
        workspaceStatus: "Estado del workspace",
        activeToday: "Activos hoy",
        livePresence: "Presencia en vivo",
        members: "Miembros",
        onlineNow: "Online ahora",
        recentEvents: "Eventos recientes",
        totalMembersDescription: "Total de miembros dentro de esta cuenta.",
        onlineDescription: "Activos en los ÃƒÂºltimos 5 minutos.",
        activeTodayDescription: "Miembros con actividad hoy.",
        recentEventsDescription: "ÃƒÅ¡ltimos registros de actividad cargados.",
        leaderboard: "ClasificaciÃƒÂ³n",
        mostActiveMembers: "Miembros mÃƒÂ¡s activos",
        topFive: "Top 5",
        logins: "accesos",
        noMembers: "No hay miembros disponibles.",
        onlineMembers: "Miembros online",
        lastActivity: "ÃƒÅ¡ltima actividad",
        online: "Online",
        noOnlineMembers: "No hay miembros online ahora.",
        attention: "AtenciÃƒÂ³n",
        inactiveMembers: "Miembros inactivos",
        offline: "Offline",
        allMembersActive: "Todos los miembros parecen activos.",
        audit: "AuditorÃƒÂ­a",
        recentActivity: "Actividad reciente",
        viewAll: "Ver todo",
        noRecentActivity: "No hay actividad reciente.",
        waitingForMembers: "Esperando miembros",
        fullyActiveToday: "Todos activos hoy",
        liveActivityDetected: "Actividad en vivo detectada",
        activityRecordedToday: "Actividad registrada hoy",
        quietWorkspace: "Workspace silencioso",
    },
    fr: {
        never: "Jamais",
        workspaceIntelligence: "Intelligence du workspace",
        description:
            "Suivi de lÃ¢â‚¬â„¢ÃƒÂ©quipe, activitÃƒÂ© rÃƒÂ©cente, membres en ligne et utilisation rÃƒÂ©elle du workspace.",
        manageMembers: "GÃƒÂ©rer les membres",
        viewActivity: "Voir lÃ¢â‚¬â„¢activitÃƒÂ©",
        workspaceStatus: "Statut du workspace",
        activeToday: "Actifs aujourdÃ¢â‚¬â„¢hui",
        livePresence: "PrÃƒÂ©sence en direct",
        members: "Membres",
        onlineNow: "En ligne maintenant",
        recentEvents: "Ãƒâ€°vÃƒÂ©nements rÃƒÂ©cents",
        totalMembersDescription: "Nombre total de membres dans ce compte.",
        onlineDescription: "Actifs au cours des 5 derniÃƒÂ¨res minutes.",
        activeTodayDescription: "Membres avec activitÃƒÂ© aujourdÃ¢â‚¬â„¢hui.",
        recentEventsDescription: "Derniers enregistrements dÃ¢â‚¬â„¢activitÃƒÂ© chargÃƒÂ©s.",
        leaderboard: "Classement",
        mostActiveMembers: "Membres les plus actifs",
        topFive: "Top 5",
        logins: "connexions",
        noMembers: "Aucun membre disponible.",
        onlineMembers: "Membres en ligne",
        lastActivity: "DerniÃƒÂ¨re activitÃƒÂ©",
        online: "En ligne",
        noOnlineMembers: "Aucun membre en ligne maintenant.",
        attention: "Attention",
        inactiveMembers: "Membres inactifs",
        offline: "Hors ligne",
        allMembersActive: "Tous les membres semblent actifs.",
        audit: "Audit",
        recentActivity: "ActivitÃƒÂ© rÃƒÂ©cente",
        viewAll: "Tout voir",
        noRecentActivity: "Aucune activitÃƒÂ© rÃƒÂ©cente.",
        waitingForMembers: "En attente de membres",
        fullyActiveToday: "Tous actifs aujourdÃ¢â‚¬â„¢hui",
        liveActivityDetected: "ActivitÃƒÂ© en direct dÃƒÂ©tectÃƒÂ©e",
        activityRecordedToday: "ActivitÃƒÂ© enregistrÃƒÂ©e aujourdÃ¢â‚¬â„¢hui",
        quietWorkspace: "Workspace calme",
    },
    de: {
        never: "Nie",
        workspaceIntelligence: "Workspace Intelligence",
        description:
            "Team-Monitoring, aktuelle AktivitÃƒÂ¤ten, Online-Mitglieder und reale Workspace-Nutzung.",
        manageMembers: "Mitglieder verwalten",
        viewActivity: "AktivitÃƒÂ¤t ansehen",
        workspaceStatus: "Workspace-Status",
        activeToday: "Heute aktiv",
        livePresence: "Live-PrÃƒÂ¤senz",
        members: "Mitglieder",
        onlineNow: "Jetzt online",
        recentEvents: "Aktuelle Ereignisse",
        totalMembersDescription: "Gesamtzahl der Mitglieder in diesem Konto.",
        onlineDescription: "Aktiv in den letzten 5 Minuten.",
        activeTodayDescription: "Mitglieder mit heutiger AktivitÃƒÂ¤t.",
        recentEventsDescription: "Neueste AktivitÃƒÂ¤tsdatensÃƒÂ¤tze geladen.",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Aktivste Mitglieder",
        topFive: "Top 5",
        logins: "Logins",
        noMembers: "Keine Mitglieder verfÃƒÂ¼gbar.",
        onlineMembers: "Online-Mitglieder",
        lastActivity: "Letzte AktivitÃƒÂ¤t",
        online: "Online",
        noOnlineMembers: "Derzeit keine Mitglieder online.",
        attention: "Achtung",
        inactiveMembers: "Inaktive Mitglieder",
        offline: "Offline",
        allMembersActive: "Alle Mitglieder scheinen aktiv zu sein.",
        audit: "Audit",
        recentActivity: "Aktuelle AktivitÃƒÂ¤t",
        viewAll: "Alle anzeigen",
        noRecentActivity: "Keine aktuelle AktivitÃƒÂ¤t.",
        waitingForMembers: "Warten auf Mitglieder",
        fullyActiveToday: "Heute vollstÃƒÂ¤ndig aktiv",
        liveActivityDetected: "Live-AktivitÃƒÂ¤t erkannt",
        activityRecordedToday: "AktivitÃƒÂ¤t heute aufgezeichnet",
        quietWorkspace: "Ruhiger Workspace",
    },
};

function isOnline(date?: Date | null) {
    if (!date) return false;

    return Date.now() - new Date(date).getTime() < 5 * 60 * 1000;
}

function formatDate(
    date: Date | null | undefined,
    language: AppLanguage,
    t: WorkspaceLabels
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

function formatPercent(value: number) {
    return `${value.toFixed(0)}%`;
}

function getActivityTone(type: string) {
    const normalizedType = type.toLowerCase();

    if (
        normalizedType.includes("delete") ||
        normalizedType.includes("error") ||
        normalizedType.includes("freeze")
    ) {
        return "bg-red-500/10 text-red-300";
    }

    if (
        normalizedType.includes("create") ||
        normalizedType.includes("import") ||
        normalizedType.includes("sync")
    ) {
        return "bg-accent/10 text-green-300";
    }

    if (
        normalizedType.includes("update") ||
        normalizedType.includes("edit") ||
        normalizedType.includes("reset")
    ) {
        return "bg-yellow-500/10 text-yellow-300";
    }

    return "bg-white/10 text-gray-300";
}

export default async function WorkspacePage({
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
            tradingAccount: true,
            user: true,
        },
    });

    if (!membership) {
        redirect("/accounts");
    }

    if (
        membership.role !== "MANAGER" &&
        !membership.canViewMembers
    ) {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    if (membership.tradingAccount.status === "ARCHIVED") {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    const language = normalizeAppLanguage(membership.user.appLanguage);
    const t = labels[language] ?? labels.en;

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
            user: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const activities = await prisma.activityLog.findMany({
        where: {
            accountId,
        },
        include: {
            user: true,
            account: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });

    const onlineMembers = members.filter((member) =>
        isOnline(member.user.lastActivityAt)
    );

    const activeToday = members.filter((member) => {
        if (!member.user.lastActivityAt) return false;

        const lastActivity = new Date(member.user.lastActivityAt);
        const now = new Date();

        return (
            lastActivity.getDate() === now.getDate() &&
            lastActivity.getMonth() === now.getMonth() &&
            lastActivity.getFullYear() === now.getFullYear()
        );
    });

    const inactiveMembers = members.filter(
        (member) => !isOnline(member.user.lastActivityAt)
    );

    const mostActiveMembers = [...members]
        .sort((a, b) => b.user.loginCount - a.user.loginCount)
        .slice(0, 5);

    const activeTodayRate =
        members.length > 0
            ? (activeToday.length / members.length) * 100
            : 0;

    const onlineRate =
        members.length > 0
            ? (onlineMembers.length / members.length) * 100
            : 0;

    const workspaceHealth =
        members.length === 0
            ? t.waitingForMembers
            : activeToday.length === members.length
                ? t.fullyActiveToday
                : onlineMembers.length > 0
                    ? t.liveActivityDetected
                    : activeToday.length > 0
                        ? t.activityRecordedToday
                        : t.quietWorkspace;

    const recentActivityCount = activities.length;

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_35%)]" />

                <div className="relative z-10 grid gap-8 xl:grid-cols-5">
                    <div className="xl:col-span-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                            {t.workspaceIntelligence}
                        </p>

                        <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                            {membership.tradingAccount.name}
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400">
                            {t.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={`/accounts/${accountId}/members`}
                                className="rounded-2xl bg-accent-bright px-4 py-3 text-sm font-black text-black transition hover:opacity-80"
                            >
                                {t.manageMembers}
                            </Link>

                            <Link
                                href="/activities"
                                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                            >
                                {t.viewActivity}
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 xl:col-span-2 xl:grid-cols-1">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">
                                {t.workspaceStatus}
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-white">
                                {workspaceHealth}
                            </h2>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">
                                {t.activeToday}
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-blue-400">
                                {formatPercent(activeTodayRate)}
                            </h2>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">
                                {t.livePresence}
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-accent">
                                {formatPercent(onlineRate)}
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.members}</p>
                    <h2 className="mt-2 text-3xl font-black text-white">
                        {members.length}
                    </h2>
                    <p className="mt-3 text-xs text-gray-500">
                        {t.totalMembersDescription}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.onlineNow}</p>
                    <h2 className="mt-2 text-3xl font-black text-accent">
                        {onlineMembers.length}
                    </h2>
                    <p className="mt-3 text-xs text-gray-500">
                        {t.onlineDescription}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.activeToday}</p>
                    <h2 className="mt-2 text-3xl font-black text-blue-400">
                        {activeToday.length}
                    </h2>
                    <p className="mt-3 text-xs text-gray-500">
                        {t.activeTodayDescription}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">{t.recentEvents}</p>
                    <h2 className="mt-2 text-3xl font-black text-yellow-300">
                        {recentActivityCount}
                    </h2>
                    <p className="mt-3 text-xs text-gray-500">
                        {t.recentEventsDescription}
                    </p>
                </div>
            </section>

            <section className="grid items-stretch gap-6 xl:grid-cols-2">
                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">{t.leaderboard}</p>
                                <h2 className="text-2xl font-black text-white">
                                    {t.mostActiveMembers}
                                </h2>
                            </div>
                            <span className="rounded-xl bg-accent/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-accent">
                                {t.topFive}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {mostActiveMembers.length > 0 ? (
                                mostActiveMembers.map((member, index) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-sm font-black text-accent">
                                                #{index + 1}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-white">
                                                    {member.user.name || member.user.username}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="font-black text-white">
                                                {member.user.loginCount}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {t.logins}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                    {t.noMembers}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">{t.livePresence}</p>
                                <h2 className="text-2xl font-black text-white">
                                    {t.onlineMembers}
                                </h2>
                            </div>
                            <span className="rounded-xl bg-accent/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-accent">
                                {onlineMembers.length} {t.online}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {onlineMembers.length > 0 ? (
                                onlineMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-accent/20  param($m) $m.Value -replace 'green-500', 'accent'  p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-white">
                                                {member.user.name || member.user.username}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {t.lastActivity}: {formatDate(member.user.lastActivityAt, language, t)}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-xl bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-accent">
                                            {t.online}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                    {t.noOnlineMembers}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>

            <section className="grid items-stretch gap-6 xl:grid-cols-2">
                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">{t.attention}</p>
                                <h2 className="text-2xl font-black text-white">
                                    {t.inactiveMembers}
                                </h2>
                            </div>
                            <span className="rounded-xl bg-yellow-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-yellow-300">
                                {inactiveMembers.length} {t.offline}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {inactiveMembers.length > 0 ? (
                                inactiveMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-white">
                                                {member.user.name || member.user.username}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {t.lastActivity}: {formatDate(member.user.lastActivityAt, language, t)}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-xl bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-yellow-300">
                                            {t.offline}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-accent/20  param($m) $m.Value -replace 'green-500', 'accent'  p-6 text-sm text-accent">
                                    {t.allMembersActive}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">{t.audit}</p>
                                <h2 className="text-2xl font-black text-white">
                                    {t.recentActivity}
                                </h2>
                            </div>
                            <Link
                                href="/activities"
                                className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                {t.viewAll}
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                    >
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            <span
                                                className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getActivityTone(
                                                    activity.type
                                                )}`}
                                            >
                                                {activity.type}
                                            </span>

                                            {activity.user && (
                                                <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-400">
                                                    {activity.user.username}
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-bold text-white">{activity.title}</p>

                                        {activity.description && (
                                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                                {activity.description}
                                            </p>
                                        )}

                                        <p className="mt-2 text-xs text-gray-600">
                                            {formatDate(activity.createdAt, language, t)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                    {t.noRecentActivity}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
