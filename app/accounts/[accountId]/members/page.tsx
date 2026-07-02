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
        membersActivity: "Attività membri",
        description:
            "Monitora presenza, attività e contributo operativo dei membri dentro questo account condiviso.",
        members: "Membri",
        onlineNow: "Online ora",
        activeToday: "Attivi oggi",
        totalTrades: "Trade totali",
        lastTrade: "Ultimo trade",
        noTrades: "Nessun trade",
        latestTradeDescription: "Ultimo trade registrato in questo account.",
        mostActive: "Più attivo",
        basedOnInsertedTrades: "Basato sui trade inseriti.",
        livePresence: "Presenza live",
        activeLastFiveMinutes: "Attivi negli ultimi 5 minuti.",
        accountStatus: "Stato account",
        live: "Live",
        quiet: "Silenzioso",
        presenceSnapshot: "Snapshot di presenza e attività.",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Membri più attivi",
        topFive: "Top 5",
        trades: "trade",
        onlineMembers: "Membri online",
        activeNow: "Attivo ora",
        noOnlineMembers: "Nessun membro online ora.",
        memberOverview: "Panoramica membri",
        accountTeam: "Team account",
        activityProfile:
            "Profilo attività basato su presenza, ultima attività e contributo operativo dentro questo account.",
        lastActivity: "Ultima attività",
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
        confirmRemove: "Sei sicuro? L'azione è irreversibile.",
        confirmYes: "Sì, rimuovi",
        cancelConfirm: "Annulla",
        youBadge: "Tu",
        creatorBadge: "Creatore",
        lastManagerNote: "Unico Manager — impossibile retrocedere.",
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
        lastManagerNote: "Only Manager — cannot be demoted.",
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
        never: "Ніколи",
        accountMembers: "Учасники акаунта",
        membersActivity: "Активність учасників",
        description:
            "Моніторинг присутності, активності та операційного внеску учасників у цьому спільному акаунті.",
        members: "Учасники",
        onlineNow: "Онлайн зараз",
        activeToday: "Активні сьогодні",
        totalTrades: "Усього угод",
        lastTrade: "Остання угода",
        noTrades: "Немає угод",
        latestTradeDescription: "Остання угода в цьому акаунті.",
        mostActive: "Найактивніший",
        basedOnInsertedTrades: "На основі внесених угод.",
        livePresence: "Онлайн-присутність",
        activeLastFiveMinutes: "Активні протягом останніх 5 хвилин.",
        accountStatus: "Статус акаунта",
        live: "Live",
        quiet: "Тихо",
        presenceSnapshot: "Знімок присутності та активності.",
        leaderboard: "Рейтинг",
        mostActiveMembers: "Найактивніші учасники",
        topFive: "Топ 5",
        trades: "угод",
        onlineMembers: "Учасники онлайн",
        activeNow: "Активний зараз",
        noOnlineMembers: "Зараз немає учасників онлайн.",
        memberOverview: "Огляд учасників",
        accountTeam: "Команда акаунта",
        activityProfile:
            "Профіль активності на основі присутності, останньої активності та торгового внеску в цьому акаунті.",
        lastActivity: "Остання активність",
        lastLogin: "Останній вхід",
        viewMemberTrades: "Переглянути угоди учасника",
        memberAnalytics: "Аналітика учасника",
        openWorkspace: "Відкрити workspace",
        backToAccount: "Назад до акаунта",
        onlineStatus: "Онлайн зараз",
        activeTodayStatus: "Активний сьогодні",
        activeThisWeekStatus: "Активний цього тижня",
        inactiveStatus: "Неактивний",
        notAvailable: "Н/Д",
        teamManagementSection: "Управління командою",
        managementSectionLabel: "Управління",
        inviteMemberHeading: "Запросити учасника",
        usernamePlaceholder: "Username",
        sendInvite: "Надіслати запрошення",
        pendingInvitesHeading: "Запрошення в очікуванні",
        noPendingInvites: "Немає запрошень в очікуванні.",
        cancelInvite: "Скасувати запрошення",
        invitedAs: "Запрошений як",
        changeRoleLabel: "Змінити роль",
        saveRole: "Зберегти роль",
        permissionsLabel: "Операційні дозволи",
        savePermissions: "Зберегти дозволи",
        removeMemberLabel: "Видалити учасника",
        confirmRemove: "Ви впевнені? Цю дію не можна скасувати.",
        confirmYes: "Так, видалити",
        cancelConfirm: "Скасувати",
        youBadge: "Ти",
        creatorBadge: "Творець",
        lastManagerNote: "Єдиний Manager — неможливо понизити.",
        roleManager: "Менеджер",
        roleMember: "Учасник",
        roleViewer: "Спостерігач",
        perm_canCreateTrades: "Вносити угоди",
        perm_canEditTrades: "Редагувати угоди",
        perm_canDeleteTrades: "Видаляти угоди",
        perm_canViewAnalytics: "Аналітика",
        perm_canViewReports: "Звіти",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "Переглядати команду",
    },
    ru: {
        never: "Никогда",
        accountMembers: "Участники аккаунта",
        membersActivity: "Активность участников",
        description:
            "Мониторинг присутствия, активности и операционного вклада участников в этом общем аккаунте.",
        members: "Участники",
        onlineNow: "Онлайн сейчас",
        activeToday: "Активны сегодня",
        totalTrades: "Всего сделок",
        lastTrade: "Последняя сделка",
        noTrades: "Нет сделок",
        latestTradeDescription: "Последняя сделка в этом аккаунте.",
        mostActive: "Самый активный",
        basedOnInsertedTrades: "На основе внесенных сделок.",
        livePresence: "Онлайн-присутствие",
        activeLastFiveMinutes: "Активны за последние 5 минут.",
        accountStatus: "Статус аккаунта",
        live: "Live",
        quiet: "Тихо",
        presenceSnapshot: "Снимок присутствия и активности.",
        leaderboard: "Рейтинг",
        mostActiveMembers: "Самые активные участники",
        topFive: "Топ 5",
        trades: "сделок",
        onlineMembers: "Участники онлайн",
        activeNow: "Активен сейчас",
        noOnlineMembers: "Сейчас нет участников онлайн.",
        memberOverview: "Обзор участников",
        accountTeam: "Команда аккаунта",
        activityProfile:
            "Профиль активности на основе присутствия, последней активности и торгового вклада в этом аккаунте.",
        lastActivity: "Последняя активность",
        lastLogin: "Последний вход",
        viewMemberTrades: "Смотреть сделки участника",
        memberAnalytics: "Аналитика участника",
        openWorkspace: "Открыть workspace",
        backToAccount: "Назад к аккаунту",
        onlineStatus: "Онлайн сейчас",
        activeTodayStatus: "Активен сегодня",
        activeThisWeekStatus: "Активен на этой неделе",
        inactiveStatus: "Неактивен",
        notAvailable: "Н/Д",
        teamManagementSection: "Управление командой",
        managementSectionLabel: "Управление",
        inviteMemberHeading: "Пригласить участника",
        usernamePlaceholder: "Username",
        sendInvite: "Отправить приглашение",
        pendingInvitesHeading: "Ожидающие приглашения",
        noPendingInvites: "Нет ожидающих приглашений.",
        cancelInvite: "Отменить приглашение",
        invitedAs: "Приглашён как",
        changeRoleLabel: "Изменить роль",
        saveRole: "Сохранить роль",
        permissionsLabel: "Операционные разрешения",
        savePermissions: "Сохранить разрешения",
        removeMemberLabel: "Удалить участника",
        confirmRemove: "Вы уверены? Это действие необратимо.",
        confirmYes: "Да, удалить",
        cancelConfirm: "Отмена",
        youBadge: "Вы",
        creatorBadge: "Создатель",
        lastManagerNote: "Единственный Manager — нельзя понизить.",
        roleManager: "Менеджер",
        roleMember: "Участник",
        roleViewer: "Наблюдатель",
        perm_canCreateTrades: "Вносить сделки",
        perm_canEditTrades: "Редактировать сделки",
        perm_canDeleteTrades: "Удалять сделки",
        perm_canViewAnalytics: "Аналитика",
        perm_canViewReports: "Отчёты",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "Просматривать команду",
    },
    es: {
        never: "Nunca",
        accountMembers: "Miembros de la cuenta",
        membersActivity: "Actividad de miembros",
        description:
            "Monitoriza presencia, actividad y contribución operativa de los miembros dentro de esta cuenta compartida.",
        members: "Miembros",
        onlineNow: "Online ahora",
        activeToday: "Activos hoy",
        totalTrades: "Trades totales",
        lastTrade: "Último trade",
        noTrades: "Sin trades",
        latestTradeDescription: "Último trade en esta cuenta.",
        mostActive: "Más activo",
        basedOnInsertedTrades: "Basado en los trades insertados.",
        livePresence: "Presencia en vivo",
        activeLastFiveMinutes: "Activos en los últimos 5 minutos.",
        accountStatus: "Estado de cuenta",
        live: "Live",
        quiet: "Silencioso",
        presenceSnapshot: "Snapshot de presencia y actividad.",
        leaderboard: "Clasificación",
        mostActiveMembers: "Miembros más activos",
        topFive: "Top 5",
        trades: "trades",
        onlineMembers: "Miembros online",
        activeNow: "Activo ahora",
        noOnlineMembers: "No hay miembros online ahora.",
        memberOverview: "Resumen de miembros",
        accountTeam: "Equipo de cuenta",
        activityProfile:
            "Perfil de actividad basado en presencia, última actividad y contribución de trades dentro de esta cuenta.",
        lastActivity: "Última actividad",
        lastLogin: "Último login",
        viewMemberTrades: "Ver trades del miembro",
        memberAnalytics: "Analytics del miembro",
        openWorkspace: "Abrir workspace",
        backToAccount: "Volver a la cuenta",
        onlineStatus: "Online ahora",
        activeTodayStatus: "Activo hoy",
        activeThisWeekStatus: "Activo esta semana",
        inactiveStatus: "Inactivo",
        notAvailable: "N/D",
        teamManagementSection: "Gestión del equipo",
        managementSectionLabel: "Gestión",
        inviteMemberHeading: "Invitar miembro",
        usernamePlaceholder: "Usuario",
        sendInvite: "Enviar invitación",
        pendingInvitesHeading: "Invitaciones pendientes",
        noPendingInvites: "Sin invitaciones pendientes.",
        cancelInvite: "Cancelar invitación",
        invitedAs: "Invitado como",
        changeRoleLabel: "Cambiar rol",
        saveRole: "Guardar rol",
        permissionsLabel: "Permisos operativos",
        savePermissions: "Guardar permisos",
        removeMemberLabel: "Eliminar miembro",
        confirmRemove: "¿Estás seguro? Esta acción es irreversible.",
        confirmYes: "Sí, eliminar",
        cancelConfirm: "Cancelar",
        youBadge: "Tú",
        creatorBadge: "Creador",
        lastManagerNote: "Único Manager — no se puede degradar.",
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
        membersActivity: "Activité des membres",
        description:
            "Surveille la présence, l'activité et la contribution opérationnelle des membres dans ce compte partagé.",
        members: "Membres",
        onlineNow: "En ligne maintenant",
        activeToday: "Actifs aujourd'hui",
        totalTrades: "Trades totaux",
        lastTrade: "Dernier trade",
        noTrades: "Aucun trade",
        latestTradeDescription: "Dernier trade enregistré dans ce compte.",
        mostActive: "Le plus actif",
        basedOnInsertedTrades: "Basé sur les trades saisis.",
        livePresence: "Présence en direct",
        activeLastFiveMinutes: "Actifs au cours des 5 dernières minutes.",
        accountStatus: "Statut du compte",
        live: "Live",
        quiet: "Calme",
        presenceSnapshot: "Snapshot de présence et d'activité.",
        leaderboard: "Classement",
        mostActiveMembers: "Membres les plus actifs",
        topFive: "Top 5",
        trades: "trades",
        onlineMembers: "Membres en ligne",
        activeNow: "Actif maintenant",
        noOnlineMembers: "Aucun membre en ligne maintenant.",
        memberOverview: "Vue d'ensemble des membres",
        accountTeam: "Équipe du compte",
        activityProfile:
            "Profil d'activité basé sur la présence, la dernière activité et la contribution trading dans ce compte.",
        lastActivity: "Dernière activité",
        lastLogin: "Dernière connexion",
        viewMemberTrades: "Voir les trades du membre",
        memberAnalytics: "Analytics du membre",
        openWorkspace: "Ouvrir le workspace",
        backToAccount: "Retour au compte",
        onlineStatus: "En ligne maintenant",
        activeTodayStatus: "Actif aujourd'hui",
        activeThisWeekStatus: "Actif cette semaine",
        inactiveStatus: "Inactif",
        notAvailable: "N/D",
        teamManagementSection: "Gestion de l'équipe",
        managementSectionLabel: "Gestion",
        inviteMemberHeading: "Inviter un membre",
        usernamePlaceholder: "Nom d'utilisateur",
        sendInvite: "Envoyer l'invitation",
        pendingInvitesHeading: "Invitations en attente",
        noPendingInvites: "Aucune invitation en attente.",
        cancelInvite: "Annuler l'invitation",
        invitedAs: "Invité comme",
        changeRoleLabel: "Changer le rôle",
        saveRole: "Enregistrer le rôle",
        permissionsLabel: "Permissions opérationnelles",
        savePermissions: "Enregistrer les permissions",
        removeMemberLabel: "Supprimer le membre",
        confirmRemove: "Êtes-vous sûr ? Cette action est irréversible.",
        confirmYes: "Oui, supprimer",
        cancelConfirm: "Annuler",
        youBadge: "Vous",
        creatorBadge: "Créateur",
        lastManagerNote: "Seul Manager — impossible de rétrograder.",
        roleManager: "Manager",
        roleMember: "Membre",
        roleViewer: "Observateur",
        perm_canCreateTrades: "Créer des trades",
        perm_canEditTrades: "Modifier des trades",
        perm_canDeleteTrades: "Supprimer des trades",
        perm_canViewAnalytics: "Analytics",
        perm_canViewReports: "Rapports",
        perm_canViewCopilot: "Copilot",
        perm_canViewMembers: "Voir l'équipe",
    },
    de: {
        never: "Nie",
        accountMembers: "Kontomitglieder",
        membersActivity: "Mitgliederaktivität",
        description:
            "Überwache Präsenz, Aktivität und operativen Beitrag der Mitglieder in diesem gemeinsamen Konto.",
        members: "Mitglieder",
        onlineNow: "Jetzt online",
        activeToday: "Heute aktiv",
        totalTrades: "Gesamte Trades",
        lastTrade: "Letzter Trade",
        noTrades: "Keine Trades",
        latestTradeDescription: "Letzter Trade in diesem Konto.",
        mostActive: "Aktivstes Mitglied",
        basedOnInsertedTrades: "Basierend auf eingetragenen Trades.",
        livePresence: "Live-Präsenz",
        activeLastFiveMinutes: "Aktiv in den letzten 5 Minuten.",
        accountStatus: "Kontostatus",
        live: "Live",
        quiet: "Ruhig",
        presenceSnapshot: "Snapshot von Präsenz und Aktivität.",
        leaderboard: "Leaderboard",
        mostActiveMembers: "Aktivste Mitglieder",
        topFive: "Top 5",
        trades: "Trades",
        onlineMembers: "Online-Mitglieder",
        activeNow: "Jetzt aktiv",
        noOnlineMembers: "Derzeit keine Mitglieder online.",
        memberOverview: "Mitgliederübersicht",
        accountTeam: "Kontoteam",
        activityProfile:
            "Aktivitätsprofil basierend auf Login-Präsenz, letzter Aktivität und Trade-Beitrag in diesem Konto.",
        lastActivity: "Letzte Aktivität",
        lastLogin: "Letzter Login",
        viewMemberTrades: "Trades des Mitglieds ansehen",
        memberAnalytics: "Mitglieder-Analytics",
        openWorkspace: "Workspace öffnen",
        backToAccount: "Zurück zum Konto",
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
        changeRoleLabel: "Rolle ändern",
        saveRole: "Rolle speichern",
        permissionsLabel: "Betriebsberechtigungen",
        savePermissions: "Berechtigungen speichern",
        removeMemberLabel: "Mitglied entfernen",
        confirmRemove: "Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden.",
        confirmYes: "Ja, entfernen",
        cancelConfirm: "Abbrechen",
        youBadge: "Du",
        creatorBadge: "Ersteller",
        lastManagerNote: "Einziger Manager — kann nicht heruntergestuft werden.",
        roleManager: "Manager",
        roleMember: "Mitglied",
        roleViewer: "Beobachter",
        perm_canCreateTrades: "Trades erstellen",
        perm_canEditTrades: "Trades bearbeiten",
        perm_canDeleteTrades: "Trades löschen",
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
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-accent-bright)_12%,transparent),transparent_35%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_30%)]" />

                <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-accent-bright/20 bg-accent-bright/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-accent-bright">
                                {t.accountMembers}
                            </span>
                        </div>

                        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">
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

            {/* Team Management — only for canManageMembers */}
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
                                                    {t.invitedAs} · {invite.role}
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
                                                ? `${member.lastTrade.symbol} · ${formatDate(
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

                                {/* Per-member management — hidden on own card */}
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
