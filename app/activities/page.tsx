import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    formatDateByLanguage,
    formatDateTimeByLanguage,
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    Activity,
    CandlestickChart,
    ChevronDown,
    CircleEllipsis,
    LifeBuoy,
    Plug,
    Shield,
    ShieldCheck,
    Sparkles,
    WalletCards,
    type LucideIcon,
} from "lucide-react";

const PAGE_SIZE = 25;

type ActivityCategory =
    | "accounts"
    | "trades"
    | "trading"
    | "integrations"
    | "copilot"
    | "profileSecurity"
    | "support"
    | "administration"
    | "other";

type ActivityLabels = {
    eyebrow: string;
    title: string;
    description: string;
    changes: string;
    emptyState: string;
    enabled: string;
    disabled: string;
    emptyValue: string;
    today: string;
    yesterday: string;
    details: string;
    before: string;
    after: string;
    categories: Record<ActivityCategory, string>;
    presentation: Record<string, string>;
};

const activityLabels: Record<AppLanguage, ActivityLabels> = {
    it: {
        eyebrow: "Activity Feed",
        title: "La mia attività",
        description:
            "Una cronologia privata delle azioni che hai eseguito in VOLTIS.",
        changes: "Modifiche",
        emptyState: "Nessuna attività registrata per ora.",
        enabled: "Attivo",
        disabled: "Disattivo",
        emptyValue: "-",
        today: "Oggi",
        yesterday: "Ieri",
        details: "Dettagli",
        before: "Prima",
        after: "Dopo",
        categories: { accounts: "Ciclo account", trades: "Attività trade", trading: "Flusso trading", integrations: "Integrazione", copilot: "Copilot", profileSecurity: "Profilo e sicurezza", support: "Supporto", administration: "Amministrazione", other: "Attività" },
        presentation: { activityRecorded: "Attività registrata", tradingAccount: "Account di trading", trade: "trade", createdAccount: "Creato “{value}”", accountAdded: "Account aggiunto alla tua libreria.", archivedAccount: "Archiviato “{value}”", accountArchived: "Account spostato nell’archivio.", restoredAccount: "Ripristinato “{value}”", accountRestored: "Account riportato nella libreria attiva.", deletedAccount: "Eliminato “{value}”", accountDeleted: "Account rimosso definitivamente.", requestedReview: "Richiesta una revisione per “{value}”", reviewSubmitted: "Revisione account inviata.", createdTrade: "Creato trade {value}", updatedTrade: "Aggiornato trade {value}", tradeChanged: "I dettagli del trade sono stati modificati.", deletedTrade: "Eliminato trade {value}", tradeRemoved: "Trade rimosso dal diario.", importedTrade: "Importato trade {value}", importedFrom: "Trade importato da {value}.", syncedTrade: "Sincronizzato trade {value}", syncedTradeDescription: "Trade aggiornato dall’integrazione connessa.", syncFailed: "Sincronizzazione trade non riuscita", syncFailedDescription: "Non è stato possibile sincronizzare il trade.", createdSession: "Creata una sessione di trading", sessionNamed: "Sessione “{value}” registrata.", goalsUpdated: "Aggiornate regole e obiettivi di trading", workflowChanged: "Le impostazioni del flusso di trading sono state modificate.", integrationUpdated: "Aggiornate le impostazioni di integrazione", connectionChanged: "Le preferenze di connessione sono state modificate.", syncReset: "Reimpostata la sincronizzazione", syncResetDescription: "Lo stato di sincronizzazione è stato reimpostato.", copilotAnalysis: "Richiesta un’analisi Copilot", copilotAnalysisDescription: "Copilot ha generato una nuova analisi dell’account.", copilotMessage: "Inviato un messaggio a Copilot", copilotMessageDescription: "La conversazione con Copilot è stata aggiornata.", profileUpdated: "Aggiornato il profilo", profileChanged: "Le informazioni personali del profilo sono state modificate.", passwordChanged: "Modificata la password", passwordUpdated: "La password dell’account è stata aggiornata.", settingsUpdated: "Aggiornate le impostazioni", preferencesChanged: "Le preferenze personali sono state modificate.", supportCreated: "Creata una richiesta di supporto", supportSubmitted: "Richiesta di supporto inviata.", supportUpdated: "Aggiornata una richiesta di supporto", supportUpdatedDescription: "Lo stato della richiesta di supporto è cambiato.", administrationRecorded: "Azione amministrativa registrata", administrationChanged: "Una configurazione amministrativa è stata modificata." },
    },

    en: {
        eyebrow: "Activity Feed",
        title: "My Activity",
        description:
            "A private history of the actions you performed across VOLTIS.",
        changes: "Changes",
        emptyState: "No activity recorded yet.",
        enabled: "Enabled",
        disabled: "Disabled",
        emptyValue: "-",
        today: "Today",
        yesterday: "Yesterday",
        details: "Details",
        before: "Before",
        after: "After",
        categories: { accounts: "Account lifecycle", trades: "Trade activity", trading: "Trading workflow", integrations: "Integration", copilot: "Copilot", profileSecurity: "Profile & security", support: "Support", administration: "Administration", other: "Activity" },
        presentation: { activityRecorded: "Activity recorded", tradingAccount: "Trading account", trade: "trade", createdAccount: "Created “{value}”", accountAdded: "Account added to your library.", archivedAccount: "Archived “{value}”", accountArchived: "Account moved to the archive.", restoredAccount: "Restored “{value}”", accountRestored: "Account returned to your active library.", deletedAccount: "Deleted “{value}”", accountDeleted: "Account permanently removed.", requestedReview: "Requested a review for “{value}”", reviewSubmitted: "Account review submitted.", createdTrade: "Created {value} trade", updatedTrade: "Updated {value} trade", tradeChanged: "Trade details were changed.", deletedTrade: "Deleted {value} trade", tradeRemoved: "Trade removed from the diary.", importedTrade: "Imported {value} trade", importedFrom: "Trade imported from {value}.", syncedTrade: "Synced {value} trade", syncedTradeDescription: "Trade updated from the connected integration.", syncFailed: "Trade sync failed", syncFailedDescription: "The trade could not be synchronized.", createdSession: "Created a trading session", sessionNamed: "Session “{value}” was recorded.", goalsUpdated: "Updated trading rules and goals", workflowChanged: "Trading workflow settings were changed.", integrationUpdated: "Updated integration settings", connectionChanged: "Connection preferences were changed.", syncReset: "Reset integration sync", syncResetDescription: "Synchronization state was reset.", copilotAnalysis: "Requested a Copilot analysis", copilotAnalysisDescription: "Copilot generated a new account analysis.", copilotMessage: "Sent a message to Copilot", copilotMessageDescription: "Copilot conversation updated.", profileUpdated: "Updated profile", profileChanged: "Personal profile information was changed.", passwordChanged: "Changed password", passwordUpdated: "Account password was updated.", settingsUpdated: "Updated settings", preferencesChanged: "Personal preferences were changed.", supportCreated: "Created a support request", supportSubmitted: "Support request submitted.", supportUpdated: "Updated a support request", supportUpdatedDescription: "Support request status changed.", administrationRecorded: "Administrative action recorded", administrationChanged: "An administrative setting was changed." },
    },

    uk: {
        eyebrow: "Стрічка активності",
        title: "Моя активність",
        description:
            "Приватна історія дій, які ви виконували у VOLTIS.",
        changes: "Зміни",
        emptyState: "Поки що немає зареєстрованої активності.",
        enabled: "Увімкнено",
        disabled: "Вимкнено",
        emptyValue: "-",
        today: "Сьогодні",
        yesterday: "Учора",
        details: "Деталі",
        before: "До",
        after: "Після",
        categories: { accounts: "Життєвий цикл акаунта", trades: "Торгова активність", trading: "Торговий процес", integrations: "Інтеграція", copilot: "Copilot", profileSecurity: "Профіль і безпека", support: "Підтримка", administration: "Адміністрування", other: "Активність" },
        presentation: { activityRecorded: "Активність записано", tradingAccount: "Торговий акаунт", trade: "угоду", createdAccount: "Створено «{value}»", accountAdded: "Акаунт додано до вашої бібліотеки.", archivedAccount: "Архівовано «{value}»", accountArchived: "Акаунт переміщено до архіву.", restoredAccount: "Відновлено «{value}»", accountRestored: "Акаунт повернуто до активної бібліотеки.", deletedAccount: "Видалено «{value}»", accountDeleted: "Акаунт видалено назавжди.", requestedReview: "Запитано перевірку для «{value}»", reviewSubmitted: "Запит на перевірку акаунта надіслано.", createdTrade: "Створено угоду {value}", updatedTrade: "Оновлено угоду {value}", tradeChanged: "Деталі угоди змінено.", deletedTrade: "Видалено угоду {value}", tradeRemoved: "Угоду видалено з щоденника.", importedTrade: "Імпортовано угоду {value}", importedFrom: "Угоду імпортовано з {value}.", syncedTrade: "Синхронізовано угоду {value}", syncedTradeDescription: "Угоду оновлено через підключену інтеграцію.", syncFailed: "Не вдалося синхронізувати угоду", syncFailedDescription: "Угоду не вдалося синхронізувати.", createdSession: "Створено торгову сесію", sessionNamed: "Сесію «{value}» записано.", goalsUpdated: "Оновлено торгові правила та цілі", workflowChanged: "Налаштування торгового процесу змінено.", integrationUpdated: "Оновлено налаштування інтеграції", connectionChanged: "Параметри підключення змінено.", syncReset: "Скинуто синхронізацію інтеграції", syncResetDescription: "Стан синхронізації скинуто.", copilotAnalysis: "Запитано аналіз Copilot", copilotAnalysisDescription: "Copilot створив новий аналіз акаунта.", copilotMessage: "Надіслано повідомлення Copilot", copilotMessageDescription: "Розмову з Copilot оновлено.", profileUpdated: "Оновлено профіль", profileChanged: "Особисті дані профілю змінено.", passwordChanged: "Змінено пароль", passwordUpdated: "Пароль акаунта оновлено.", settingsUpdated: "Оновлено налаштування", preferencesChanged: "Особисті налаштування змінено.", supportCreated: "Створено запит до підтримки", supportSubmitted: "Запит до підтримки надіслано.", supportUpdated: "Оновлено запит до підтримки", supportUpdatedDescription: "Статус запиту до підтримки змінено.", administrationRecorded: "Адміністративну дію записано", administrationChanged: "Адміністративне налаштування змінено." },
    },

    ru: {
        eyebrow: "Лента активности",
        title: "Моя активность",
        description:
            "Приватная история действий, выполненных вами в VOLTIS.",
        changes: "Изменения",
        emptyState: "Пока нет зарегистрированной активности.",
        enabled: "Включено",
        disabled: "Отключено",
        emptyValue: "-",
        today: "Сегодня",
        yesterday: "Вчера",
        details: "Детали",
        before: "До",
        after: "После",
        categories: { accounts: "Жизненный цикл аккаунта", trades: "Торговая активность", trading: "Торговый процесс", integrations: "Интеграция", copilot: "Copilot", profileSecurity: "Профиль и безопасность", support: "Поддержка", administration: "Администрирование", other: "Активность" },
        presentation: { activityRecorded: "Активность записана", tradingAccount: "Торговый аккаунт", trade: "сделку", createdAccount: "Создан «{value}»", accountAdded: "Аккаунт добавлен в вашу библиотеку.", archivedAccount: "Архивирован «{value}»", accountArchived: "Аккаунт перемещён в архив.", restoredAccount: "Восстановлен «{value}»", accountRestored: "Аккаунт возвращён в активную библиотеку.", deletedAccount: "Удалён «{value}»", accountDeleted: "Аккаунт удалён навсегда.", requestedReview: "Запрошена проверка для «{value}»", reviewSubmitted: "Запрос на проверку аккаунта отправлен.", createdTrade: "Создана сделка {value}", updatedTrade: "Обновлена сделка {value}", tradeChanged: "Детали сделки изменены.", deletedTrade: "Удалена сделка {value}", tradeRemoved: "Сделка удалена из дневника.", importedTrade: "Импортирована сделка {value}", importedFrom: "Сделка импортирована из {value}.", syncedTrade: "Синхронизирована сделка {value}", syncedTradeDescription: "Сделка обновлена через подключённую интеграцию.", syncFailed: "Синхронизация сделки не удалась", syncFailedDescription: "Сделку не удалось синхронизировать.", createdSession: "Создана торговая сессия", sessionNamed: "Сессия «{value}» записана.", goalsUpdated: "Обновлены торговые правила и цели", workflowChanged: "Настройки торгового процесса изменены.", integrationUpdated: "Обновлены настройки интеграции", connectionChanged: "Параметры подключения изменены.", syncReset: "Сброшена синхронизация интеграции", syncResetDescription: "Состояние синхронизации сброшено.", copilotAnalysis: "Запрошен анализ Copilot", copilotAnalysisDescription: "Copilot создал новый анализ аккаунта.", copilotMessage: "Отправлено сообщение Copilot", copilotMessageDescription: "Диалог с Copilot обновлён.", profileUpdated: "Обновлён профиль", profileChanged: "Личные данные профиля изменены.", passwordChanged: "Изменён пароль", passwordUpdated: "Пароль аккаунта обновлён.", settingsUpdated: "Обновлены настройки", preferencesChanged: "Личные предпочтения изменены.", supportCreated: "Создан запрос в поддержку", supportSubmitted: "Запрос в поддержку отправлен.", supportUpdated: "Обновлён запрос в поддержку", supportUpdatedDescription: "Статус запроса в поддержку изменён.", administrationRecorded: "Административное действие записано", administrationChanged: "Административная настройка изменена." },
    },

    es: {
        eyebrow: "Feed de actividad",
        title: "Mi actividad",
        description:
            "Un historial privado de las acciones que realizaste en VOLTIS.",
        changes: "Cambios",
        emptyState: "Aún no hay actividad registrada.",
        enabled: "Activado",
        disabled: "Desactivado",
        emptyValue: "-",
        today: "Hoy",
        yesterday: "Ayer",
        details: "Detalles",
        before: "Antes",
        after: "Después",
        categories: { accounts: "Ciclo de la cuenta", trades: "Actividad de trades", trading: "Flujo de trading", integrations: "Integración", copilot: "Copilot", profileSecurity: "Perfil y seguridad", support: "Soporte", administration: "Administración", other: "Actividad" },
        presentation: { activityRecorded: "Actividad registrada", tradingAccount: "Cuenta de trading", trade: "trade", createdAccount: "Creada “{value}”", accountAdded: "Cuenta añadida a tu biblioteca.", archivedAccount: "Archivada “{value}”", accountArchived: "Cuenta movida al archivo.", restoredAccount: "Restaurada “{value}”", accountRestored: "Cuenta devuelta a tu biblioteca activa.", deletedAccount: "Eliminada “{value}”", accountDeleted: "Cuenta eliminada permanentemente.", requestedReview: "Solicitada una revisión para “{value}”", reviewSubmitted: "Revisión de cuenta enviada.", createdTrade: "Creado trade de {value}", updatedTrade: "Actualizado trade de {value}", tradeChanged: "Los detalles del trade cambiaron.", deletedTrade: "Eliminado trade de {value}", tradeRemoved: "Trade eliminado del diario.", importedTrade: "Importado trade de {value}", importedFrom: "Trade importado desde {value}.", syncedTrade: "Sincronizado trade de {value}", syncedTradeDescription: "Trade actualizado desde la integración conectada.", syncFailed: "Falló la sincronización del trade", syncFailedDescription: "No se pudo sincronizar el trade.", createdSession: "Creada una sesión de trading", sessionNamed: "Se registró la sesión “{value}”.", goalsUpdated: "Actualizadas reglas y objetivos de trading", workflowChanged: "La configuración del flujo de trading cambió.", integrationUpdated: "Actualizada la configuración de integración", connectionChanged: "Las preferencias de conexión cambiaron.", syncReset: "Reiniciada la sincronización", syncResetDescription: "El estado de sincronización se reinició.", copilotAnalysis: "Solicitado un análisis de Copilot", copilotAnalysisDescription: "Copilot generó un nuevo análisis de cuenta.", copilotMessage: "Enviado un mensaje a Copilot", copilotMessageDescription: "La conversación con Copilot se actualizó.", profileUpdated: "Actualizado el perfil", profileChanged: "La información personal del perfil cambió.", passwordChanged: "Cambiada la contraseña", passwordUpdated: "La contraseña de la cuenta se actualizó.", settingsUpdated: "Actualizada la configuración", preferencesChanged: "Las preferencias personales cambiaron.", supportCreated: "Creada una solicitud de soporte", supportSubmitted: "Solicitud de soporte enviada.", supportUpdated: "Actualizada una solicitud de soporte", supportUpdatedDescription: "El estado de la solicitud de soporte cambió.", administrationRecorded: "Acción administrativa registrada", administrationChanged: "Una configuración administrativa cambió." },
    },

    fr: {
        eyebrow: "Flux d’activité",
        title: "Mon activité",
        description:
            "Un historique privé des actions que vous avez effectuées dans VOLTIS.",
        changes: "Modifications",
        emptyState: "Aucune activité enregistrée pour le moment.",
        enabled: "Activé",
        disabled: "Désactivé",
        emptyValue: "-",
        today: "Aujourd’hui",
        yesterday: "Hier",
        details: "Détails",
        before: "Avant",
        after: "Après",
        categories: { accounts: "Cycle du compte", trades: "Activité de trading", trading: "Flux de trading", integrations: "Intégration", copilot: "Copilot", profileSecurity: "Profil et sécurité", support: "Support", administration: "Administration", other: "Activité" },
        presentation: { activityRecorded: "Activité enregistrée", tradingAccount: "Compte de trading", trade: "trade", createdAccount: "Créé « {value} »", accountAdded: "Compte ajouté à votre bibliothèque.", archivedAccount: "Archivé « {value} »", accountArchived: "Compte déplacé vers les archives.", restoredAccount: "Restauré « {value} »", accountRestored: "Compte réintégré à votre bibliothèque active.", deletedAccount: "Supprimé « {value} »", accountDeleted: "Compte supprimé définitivement.", requestedReview: "Révision demandée pour « {value} »", reviewSubmitted: "Demande de révision du compte envoyée.", createdTrade: "Trade {value} créé", updatedTrade: "Trade {value} mis à jour", tradeChanged: "Les détails du trade ont été modifiés.", deletedTrade: "Trade {value} supprimé", tradeRemoved: "Trade supprimé du journal.", importedTrade: "Trade {value} importé", importedFrom: "Trade importé depuis {value}.", syncedTrade: "Trade {value} synchronisé", syncedTradeDescription: "Trade mis à jour depuis l’intégration connectée.", syncFailed: "Échec de la synchronisation du trade", syncFailedDescription: "Le trade n’a pas pu être synchronisé.", createdSession: "Session de trading créée", sessionNamed: "Session « {value} » enregistrée.", goalsUpdated: "Règles et objectifs de trading mis à jour", workflowChanged: "Les paramètres du flux de trading ont été modifiés.", integrationUpdated: "Paramètres d’intégration mis à jour", connectionChanged: "Les préférences de connexion ont été modifiées.", syncReset: "Synchronisation de l’intégration réinitialisée", syncResetDescription: "L’état de synchronisation a été réinitialisé.", copilotAnalysis: "Analyse Copilot demandée", copilotAnalysisDescription: "Copilot a généré une nouvelle analyse du compte.", copilotMessage: "Message envoyé à Copilot", copilotMessageDescription: "La conversation Copilot a été mise à jour.", profileUpdated: "Profil mis à jour", profileChanged: "Les informations personnelles du profil ont été modifiées.", passwordChanged: "Mot de passe modifié", passwordUpdated: "Le mot de passe du compte a été mis à jour.", settingsUpdated: "Paramètres mis à jour", preferencesChanged: "Les préférences personnelles ont été modifiées.", supportCreated: "Demande de support créée", supportSubmitted: "Demande de support envoyée.", supportUpdated: "Demande de support mise à jour", supportUpdatedDescription: "Le statut de la demande de support a changé.", administrationRecorded: "Action administrative enregistrée", administrationChanged: "Un paramètre administratif a été modifié." },
    },

    de: {
        eyebrow: "Aktivitätsfeed",
        title: "Meine Aktivität",
        description:
            "Ein privater Verlauf deiner in VOLTIS ausgeführten Aktionen.",
        changes: "Änderungen",
        emptyState: "Noch keine Aktivität aufgezeichnet.",
        enabled: "Aktiviert",
        disabled: "Deaktiviert",
        emptyValue: "-",
        today: "Heute",
        yesterday: "Gestern",
        details: "Details",
        before: "Vorher",
        after: "Nachher",
        categories: { accounts: "Konto-Lebenszyklus", trades: "Trade-Aktivität", trading: "Trading-Ablauf", integrations: "Integration", copilot: "Copilot", profileSecurity: "Profil und Sicherheit", support: "Support", administration: "Administration", other: "Aktivität" },
        presentation: { activityRecorded: "Aktivität erfasst", tradingAccount: "Trading-Konto", trade: "Trade", createdAccount: "„{value}“ erstellt", accountAdded: "Konto zu deiner Bibliothek hinzugefügt.", archivedAccount: "„{value}“ archiviert", accountArchived: "Konto ins Archiv verschoben.", restoredAccount: "„{value}“ wiederhergestellt", accountRestored: "Konto in die aktive Bibliothek zurückgeführt.", deletedAccount: "„{value}“ gelöscht", accountDeleted: "Konto dauerhaft entfernt.", requestedReview: "Überprüfung für „{value}“ angefordert", reviewSubmitted: "Kontoüberprüfung eingereicht.", createdTrade: "{value}-Trade erstellt", updatedTrade: "{value}-Trade aktualisiert", tradeChanged: "Trade-Details wurden geändert.", deletedTrade: "{value}-Trade gelöscht", tradeRemoved: "Trade aus dem Journal entfernt.", importedTrade: "{value}-Trade importiert", importedFrom: "Trade aus {value} importiert.", syncedTrade: "{value}-Trade synchronisiert", syncedTradeDescription: "Trade über die verbundene Integration aktualisiert.", syncFailed: "Trade-Synchronisierung fehlgeschlagen", syncFailedDescription: "Der Trade konnte nicht synchronisiert werden.", createdSession: "Trading-Session erstellt", sessionNamed: "Session „{value}“ wurde erfasst.", goalsUpdated: "Trading-Regeln und Ziele aktualisiert", workflowChanged: "Einstellungen des Trading-Ablaufs wurden geändert.", integrationUpdated: "Integrationseinstellungen aktualisiert", connectionChanged: "Verbindungseinstellungen wurden geändert.", syncReset: "Integrations-Synchronisierung zurückgesetzt", syncResetDescription: "Synchronisierungsstatus wurde zurückgesetzt.", copilotAnalysis: "Copilot-Analyse angefordert", copilotAnalysisDescription: "Copilot hat eine neue Kontoanalyse erstellt.", copilotMessage: "Nachricht an Copilot gesendet", copilotMessageDescription: "Copilot-Unterhaltung wurde aktualisiert.", profileUpdated: "Profil aktualisiert", profileChanged: "Persönliche Profilinformationen wurden geändert.", passwordChanged: "Passwort geändert", passwordUpdated: "Kontopasswort wurde aktualisiert.", settingsUpdated: "Einstellungen aktualisiert", preferencesChanged: "Persönliche Einstellungen wurden geändert.", supportCreated: "Support-Anfrage erstellt", supportSubmitted: "Support-Anfrage eingereicht.", supportUpdated: "Support-Anfrage aktualisiert", supportUpdatedDescription: "Status der Support-Anfrage wurde geändert.", administrationRecorded: "Administrative Aktion erfasst", administrationChanged: "Eine administrative Einstellung wurde geändert." },
    },
};

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function formatValue(
    value: unknown,
    labels: ActivityLabels
) {
    if (typeof value === "boolean") {
        return value ? labels.enabled : labels.disabled;
    }

    if (value === null || value === undefined) {
        return labels.emptyValue;
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return String(value);
}

function getChanges(metadata: unknown) {
    if (!isRecord(metadata)) {
        return [];
    }

    const before = metadata.before;
    const after = metadata.after;

    if (!isRecord(before) || !isRecord(after)) {
        if (
            "field" in metadata &&
            "before" in metadata &&
            "after" in metadata
        ) {
            return [
                {
                    field: String(metadata.field),
                    before: metadata.before,
                    after: metadata.after,
                },
            ];
        }

        return [];
    }

    return Object.keys(after)
        .filter((key) => before[key] !== after[key])
        .map((key) => ({
            field: key,
            before: before[key],
            after: after[key],
        }));
}

const CATEGORY_BY_TYPE: Record<string, ActivityCategory> = {
    ACCOUNT_CREATED: "accounts",
    ACCOUNT_ARCHIVED: "accounts",
    ACCOUNT_RESTORED: "accounts",
    ACCOUNT_DELETED: "accounts",
    ACCOUNT_REVIEW_REQUESTED: "accounts",
    TRADE_CREATED: "trades",
    TRADE_UPDATED: "trades",
    TRADE_DELETED: "trades",
    TRADE_IMPORTED: "trades",
    TRADE_SYNC_UPDATED: "trades",
    TRADE_SYNC_ERROR: "trades",
    TRADING_SESSION_CREATED: "trading",
    TRADING_GOALS_UPDATED: "trading",
    INTEGRATION_SETTINGS_UPDATED: "integrations",
    INTEGRATION_SYNC_RESET: "integrations",
    COPILOT_MESSAGE_SENT: "copilot",
    PROFILE_UPDATED: "profileSecurity",
    PASSWORD_CHANGED: "profileSecurity",
    SETTINGS_UPDATED: "profileSecurity",
    SUPPORT_TICKET_CREATED: "support",
    SUPPORT_TICKET_UPDATED: "support",
    USER_CREATED: "administration",
    USER_DELETED: "administration",
    USER_ROLE_UPDATED: "administration",
    USER_PERMISSIONS_UPDATED: "administration",
    USER_FROZEN: "administration",
    USER_UNFROZEN: "administration",
    PASSWORD_RESET: "administration",
    MEMBER_ADDED: "administration",
    MEMBER_REMOVED: "administration",
    MEMBER_ROLE_UPDATED: "administration",
    MEMBER_PERMISSIONS_UPDATED: "administration",
    RELEASE_NOTE_CREATED: "administration",
    MAINTENANCE_UPDATED: "administration",
};

const CATEGORY_ICON: Record<ActivityCategory, LucideIcon> = {
    accounts: WalletCards,
    trades: CandlestickChart,
    trading: Activity,
    integrations: Plug,
    copilot: Sparkles,
    profileSecurity: ShieldCheck,
    support: LifeBuoy,
    administration: Shield,
    other: CircleEllipsis,
};

const CATEGORY_TONE: Record<ActivityCategory, string> = {
    accounts: "text-slate-400 group-hover/row:text-slate-300",
    trades: "text-cyan-500/65 group-hover/row:text-cyan-300/80",
    trading: "text-sky-500/65 group-hover/row:text-sky-300/80",
    integrations: "text-indigo-400/65 group-hover/row:text-indigo-300/80",
    copilot: "text-violet-400/65 group-hover/row:text-violet-300/80",
    profileSecurity: "text-emerald-500/60 group-hover/row:text-emerald-300/75",
    support: "text-amber-500/60 group-hover/row:text-amber-300/75",
    administration: "text-slate-500 group-hover/row:text-slate-300",
    other: "text-slate-500 group-hover/row:text-slate-300",
};

type ActivityItem = {
    id: string;
    type: string;
    title: string;
    description: string | null;
    metadata: unknown;
    createdAt: Date;
    account: { name: string } | null;
    user: { username: string } | null;
};

function getDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getDayLabel(
    date: Date,
    language: AppLanguage,
    labels: ActivityLabels
) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (getDateKey(date) === getDateKey(today)) {
        return labels.today;
    }

    if (getDateKey(date) === getDateKey(yesterday)) {
        return labels.yesterday;
    }

    return formatDateByLanguage(date, language, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function isTechnicalIdentifier(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }

    const candidate = value.trim();
    return (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate) ||
        /^c[a-z0-9]{20,}$/i.test(candidate) ||
        /^(?:usr|user|acc|account|trd|trade|ses|session|tkt|ticket|cmp|cm)[_-]?[a-z0-9]{12,}$/i.test(candidate) ||
        (/^[a-z0-9_-]{24,}$/i.test(candidate) && !candidate.includes(" "))
    );
}

function containsTechnicalIdentifier(value: string) {
    return (value.match(/[a-z0-9_-]+/gi) ?? []).some(
        isTechnicalIdentifier
    );
}

function getMetadataString(metadata: unknown, key: string) {
    if (!isRecord(metadata)) {
        return undefined;
    }

    const value = metadata[key];
    if (
        typeof value !== "string" ||
        !value.trim() ||
        isTechnicalIdentifier(value)
    ) {
        return undefined;
    }

    return value.trim();
}

function isReadableText(value: unknown, maxLength = 180): value is string {
    if (typeof value !== "string") {
        return false;
    }

    const candidate = value.trim();
    return Boolean(
        candidate &&
        candidate.length <= maxLength &&
        !containsTechnicalIdentifier(candidate) &&
        !/^[A-Z0-9_]+$/.test(candidate) &&
        !candidate.startsWith("{") &&
        !candidate.startsWith("[")
    );
}

function withValue(template: string, value: string) {
    return template.replace("{value}", value);
}

function normalizeCopy(value: string) {
    return value
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function isRedundantCopy(title: string, description: string) {
    const normalizedTitle = normalizeCopy(title);
    const normalizedDescription = normalizeCopy(description);
    return (
        normalizedTitle === normalizedDescription ||
        normalizedDescription.startsWith(normalizedTitle)
    );
}

function getActivityPresentation(
    activity: ActivityItem,
    labels: ActivityLabels
) {
    const copy = labels.presentation;
    const category = CATEGORY_BY_TYPE[activity.type] ?? "other";
    const metadata = activity.metadata;
    const relationAccountName = isReadableText(activity.account?.name, 80)
        ? activity.account.name.trim()
        : undefined;
    const snapshotAccountName =
        getMetadataString(metadata, "accountName") ??
        getMetadataString(metadata, "deletedAccountName");
    const accountName =
        relationAccountName ??
        snapshotAccountName ??
        copy.tradingAccount;
    const contextualAccountName = relationAccountName ?? snapshotAccountName;
    const symbol = getMetadataString(metadata, "symbol") ?? copy.trade;
    const source = getMetadataString(metadata, "source");
    const direction = getMetadataString(metadata, "direction");
    const outcome = getMetadataString(metadata, "outcome");
    const sessionTitle = getMetadataString(metadata, "title");
    const supportSubject = getMetadataString(metadata, "subject");
    const isCopilotAnalysis =
        isRecord(metadata) && !("messageLength" in metadata);

    let title: string;
    let description: string | undefined;
    let includeAccountInContext = Boolean(contextualAccountName);

    switch (activity.type) {
        case "ACCOUNT_CREATED":
            title = withValue(copy.createdAccount, accountName);
            description = copy.accountAdded;
            includeAccountInContext = false;
            break;
        case "ACCOUNT_ARCHIVED":
            title = withValue(copy.archivedAccount, accountName);
            description = copy.accountArchived;
            includeAccountInContext = false;
            break;
        case "ACCOUNT_RESTORED":
            title = withValue(copy.restoredAccount, accountName);
            description = copy.accountRestored;
            includeAccountInContext = false;
            break;
        case "ACCOUNT_DELETED":
            title = withValue(copy.deletedAccount, accountName);
            description = copy.accountDeleted;
            includeAccountInContext = false;
            break;
        case "ACCOUNT_REVIEW_REQUESTED":
            title = withValue(copy.requestedReview, accountName);
            description = copy.reviewSubmitted;
            includeAccountInContext = false;
            break;
        case "TRADE_CREATED":
            title = withValue(copy.createdTrade, symbol);
            description = [direction, outcome].filter(Boolean).join(" · ") || undefined;
            break;
        case "TRADE_UPDATED":
            title = withValue(copy.updatedTrade, symbol);
            description = copy.tradeChanged;
            break;
        case "TRADE_DELETED":
            title = withValue(copy.deletedTrade, symbol);
            description = copy.tradeRemoved;
            break;
        case "TRADE_IMPORTED":
            title = withValue(copy.importedTrade, symbol);
            description = source ? withValue(copy.importedFrom, source) : undefined;
            break;
        case "TRADE_SYNC_UPDATED":
            title = withValue(copy.syncedTrade, symbol);
            description = copy.syncedTradeDescription;
            break;
        case "TRADE_SYNC_ERROR":
            title = copy.syncFailed;
            description = copy.syncFailedDescription;
            break;
        case "TRADING_SESSION_CREATED":
            title = copy.createdSession;
            description = sessionTitle
                ? withValue(copy.sessionNamed, sessionTitle)
                : undefined;
            break;
        case "TRADING_GOALS_UPDATED":
            title = copy.goalsUpdated;
            description = copy.workflowChanged;
            break;
        case "INTEGRATION_SETTINGS_UPDATED":
            title = copy.integrationUpdated;
            description = copy.connectionChanged;
            break;
        case "INTEGRATION_SYNC_RESET":
            title = copy.syncReset;
            description = copy.syncResetDescription;
            break;
        case "COPILOT_MESSAGE_SENT":
            title = isCopilotAnalysis
                ? copy.copilotAnalysis
                : copy.copilotMessage;
            description = isCopilotAnalysis
                ? copy.copilotAnalysisDescription
                : copy.copilotMessageDescription;
            break;
        case "PROFILE_UPDATED":
            title = copy.profileUpdated;
            description = copy.profileChanged;
            break;
        case "PASSWORD_CHANGED":
            title = copy.passwordChanged;
            description = copy.passwordUpdated;
            break;
        case "SETTINGS_UPDATED":
            title = copy.settingsUpdated;
            description = copy.preferencesChanged;
            break;
        case "SUPPORT_TICKET_CREATED":
            title = copy.supportCreated;
            description = supportSubject ?? copy.supportSubmitted;
            break;
        case "SUPPORT_TICKET_UPDATED":
            title = copy.supportUpdated;
            description = copy.supportUpdatedDescription;
            break;
        default: {
            if (category === "administration") {
                title = copy.administrationRecorded;
                description = copy.administrationChanged;
                break;
            }

            title = isReadableText(activity.title, 100)
                ? activity.title.trim()
                : copy.activityRecorded;
            description = isReadableText(activity.description)
                ? activity.description.trim()
                : undefined;
        }
    }

    if (description && isRedundantCopy(title, description)) {
        description = undefined;
    }

    return {
        title,
        description,
        accountName: contextualAccountName,
        contextLabel: includeAccountInContext && contextualAccountName
            ? `${contextualAccountName} · ${labels.categories[category]}`
            : labels.categories[category],
    };
}

function ActivityRow({
    activity,
    language,
    labels,
}: {
    activity: ActivityItem;
    language: AppLanguage;
    labels: ActivityLabels;
}) {
    const category = CATEGORY_BY_TYPE[activity.type] ?? "other";
    const Icon = CATEGORY_ICON[category];
    const changes = getChanges(activity.metadata);
    const presentation = getActivityPresentation(activity, labels);
    const time = formatDateTimeByLanguage(activity.createdAt, language, {
        hour: "2-digit",
        minute: "2-digit",
    });

    const content = (
        <div className="flex min-w-0 items-start gap-3.5 px-4 py-3.5 sm:items-center sm:px-5">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-inner border border-white/[0.055] bg-white/[0.025] transition-colors duration-base ${CATEGORY_TONE[category]}`}>
                <Icon size={16} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-5 text-slate-200">
                    {presentation.title}
                </p>
                {presentation.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-400">
                        {presentation.description}
                    </p>
                )}
                <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    {presentation.contextLabel}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start pt-0.5 sm:self-center sm:pt-0">
                <time dateTime={activity.createdAt.toISOString()} className="text-[11px] font-medium tabular-nums text-slate-500">
                    {time}
                </time>
                {changes.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-base group-hover/row:text-slate-300 group-focus-visible/summary:text-slate-300">
                        <span className="hidden sm:inline">{labels.details}</span>
                        <ChevronDown size={14} aria-hidden="true" className="transition-transform duration-base group-open/details:rotate-180 motion-reduce:transition-none" />
                    </span>
                )}
            </div>
        </div>
    );

    if (changes.length === 0) {
        return (
            <div className="group/row transition-colors duration-base hover:bg-white/[0.018]">
                {content}
            </div>
        );
    }

    return (
        <details className="group/details group/row">
            <summary className="group/summary cursor-pointer list-none outline-none transition-colors duration-base hover:bg-white/[0.025] focus-visible:bg-white/[0.025] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/25 [&::-webkit-details-marker]:hidden">
                {content}
            </summary>
            <div className="border-t border-white/[0.045] bg-black/15 px-4 py-3 sm:px-5">
                <div className="mb-2 grid grid-cols-1 gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 sm:grid-cols-[minmax(120px,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
                    <span>{labels.changes}</span>
                    <span className="hidden sm:block">{labels.before}</span>
                    <span className="hidden sm:block">{labels.after}</span>
                </div>
                <div className="divide-y divide-white/[0.04] border-y border-white/[0.04]">
                    {changes.map((change) => (
                        <div key={change.field} className="grid grid-cols-1 gap-2 py-2.5 text-xs sm:grid-cols-[minmax(120px,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-4">
                            <span className="break-words font-semibold text-slate-300">{change.field}</span>
                            <span className="min-w-0 break-words text-slate-500 sm:text-red-300/65">
                                <span className="mr-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 sm:hidden">{labels.before}</span>
                                {formatValue(change.before, labels)}
                            </span>
                            <span className="min-w-0 break-words text-slate-400 sm:text-emerald-300/70">
                                <span className="mr-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 sm:hidden">{labels.after}</span>
                                {formatValue(change.after, labels)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </details>
    );
}

export default async function ActivitiesPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            appLanguage: true,
        },
    });

    if (!currentUser) {
        redirect("/login");
    }

    const appLanguage = normalizeAppLanguage(
        currentUser.appLanguage
    );

    const t = activityLabels[appLanguage];
    const filters = await searchParams;
    const rawPage = Array.isArray(filters.page)
        ? filters.page[0]
        : filters.page;
    const parsedPage = Number(rawPage);
    const requestedPage =
        Number.isInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;
    const activityWhere = {
        userId: session.user.id,
    };

    const activityCount = await prisma.activityLog.count({
        where: activityWhere,
    });
    const totalPages = Math.max(
        1,
        Math.ceil(activityCount / PAGE_SIZE)
    );
    const currentPage = Math.min(requestedPage, totalPages);
    const pageStart =
        activityCount > 0
            ? (currentPage - 1) * PAGE_SIZE + 1
            : 0;
    const pageEnd = Math.min(
        currentPage * PAGE_SIZE,
        activityCount
    );

    const activities =
        await prisma.activityLog.findMany({
            where: activityWhere,
            include: {
                user: true,
                account: true,
            },
            orderBy: [
                { createdAt: "desc" },
                { id: "desc" },
            ],
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        });

    const pageQuery = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (key === "page" || value === undefined) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((entry) => pageQuery.append(key, entry));
        } else {
            pageQuery.set(key, value);
        }
    });
    const getPageHref = (page: number) => {
        const nextQuery = new URLSearchParams(pageQuery);
        if (page > 1) {
            nextQuery.set("page", String(page));
        }
        const queryString = nextQuery.toString();
        return `/activities${queryString ? `?${queryString}` : ""}`;
    };
    const paginationItems = (() => {
        const visiblePages = new Set<number>([1, totalPages]);

        for (
            let page = currentPage - 1;
            page <= currentPage + 1;
            page += 1
        ) {
            if (page >= 1 && page <= totalPages) {
                visiblePages.add(page);
            }
        }

        if (currentPage <= 3) {
            visiblePages.add(2);
            visiblePages.add(3);
        }

        if (currentPage >= totalPages - 2) {
            visiblePages.add(totalPages - 2);
            visiblePages.add(totalPages - 1);
        }

        const pages = Array.from(visiblePages)
            .filter((page) => page >= 1 && page <= totalPages)
            .sort((a, b) => a - b);
        const items: Array<number | "ellipsis"> = [];

        pages.forEach((page, index) => {
            const previousPage = pages[index - 1];
            if (previousPage && page - previousPage > 1) {
                items.push("ellipsis");
            }
            items.push(page);
        });

        return items;
    })();
    const activityGroups = Array.from(
        activities.reduce((groups, activity) => {
            const key = getDateKey(activity.createdAt);
            const existing = groups.get(key);

            if (existing) {
                existing.activities.push(activity);
            } else {
                groups.set(key, {
                    date: activity.createdAt,
                    activities: [activity],
                });
            }

            return groups;
        }, new Map<string, { date: Date; activities: ActivityItem[] }>())
    ).map(([key, group]) => ({ key, ...group }));

    return (
        <div>
            <div className="mb-10">
                <p className="text-sm text-accent">
                    {t.eyebrow}
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    {t.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                    {t.description}
                </p>
            </div>

            <div>
                {activityGroups.length > 0 ? (
                    <div className="space-y-7">
                        {activityGroups.map((group) => (
                            <section key={group.key} aria-labelledby={`activity-day-${group.key}`}>
                                <h2 id={`activity-day-${group.key}`} className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                    {getDayLabel(group.date, appLanguage, t)}
                                </h2>
                                <div className="divide-y divide-white/[0.045] overflow-hidden rounded-card border border-white/[0.05] bg-[#070d19]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
                                    {group.activities.map((activity) => (
                                        <ActivityRow
                                            key={activity.id}
                                            activity={activity}
                                            language={appLanguage}
                                            labels={t}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
                        {t.emptyState}
                    </div>
                )}
            </div>

            {activityCount > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card border-[0.5px] border-flash/[0.08] bg-surface-1/70 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                    <p className="text-xs font-medium text-muted-faint">
                        Showing {pageStart}–{pageEnd} of {activityCount} activities
                    </p>

                    {totalPages > 1 && (
                        <nav
                            className="flex flex-wrap items-center gap-1 rounded-inner border-[0.5px] border-flash/[0.08] bg-bg-base/25 p-1"
                            aria-label="Activity pagination"
                        >
                            {currentPage <= 1 ? (
                                <span className="inline-flex h-8 items-center justify-center rounded-inner px-3 text-xs font-semibold text-muted-faint opacity-50" aria-disabled="true">
                                    Previous
                                </span>
                            ) : (
                                <Link href={getPageHref(currentPage - 1)} className="inline-flex h-8 items-center justify-center rounded-inner px-3 text-xs font-semibold text-muted transition-colors duration-base hover:bg-white/[0.05] hover:text-white">
                                    Previous
                                </Link>
                            )}

                            <div className="flex items-center gap-1 border-x border-white/[0.07] px-1">
                                {paginationItems.map((item, index) =>
                                    item === "ellipsis" ? (
                                        <span key={`ellipsis-${index}`} className="inline-flex h-8 w-8 items-center justify-center text-xs font-semibold text-muted-faint" aria-hidden="true">
                                            ...
                                        </span>
                                    ) : item === currentPage ? (
                                        <span key={item} className="inline-flex h-8 min-w-8 items-center justify-center rounded-inner bg-accent-bright/[0.12] px-2 text-xs font-semibold text-accent-bright" aria-current="page">
                                            {item}
                                        </span>
                                    ) : (
                                        <Link key={item} href={getPageHref(item)} className="inline-flex h-8 min-w-8 items-center justify-center rounded-inner px-2 text-xs font-semibold text-muted transition-colors duration-base hover:bg-white/[0.05] hover:text-white" aria-label={`Go to page ${item}`}>
                                            {item}
                                        </Link>
                                    )
                                )}
                            </div>

                            {currentPage >= totalPages ? (
                                <span className="inline-flex h-8 items-center justify-center rounded-inner px-3 text-xs font-semibold text-muted-faint opacity-50" aria-disabled="true">
                                    Next
                                </span>
                            ) : (
                                <Link href={getPageHref(currentPage + 1)} className="inline-flex h-8 items-center justify-center rounded-inner px-3 text-xs font-semibold text-muted transition-colors duration-base hover:bg-white/[0.05] hover:text-white">
                                    Next
                                </Link>
                            )}
                        </nav>
                    )}
                </div>
            )}
        </div>
    );
}

