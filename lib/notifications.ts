import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

export const NOTIFICATION_TYPE_LABELS: Record<
  string,
  Record<AppLanguage, string>
> = {
  TRADE_CREATED: {
    it: "Nuovo trade",
    en: "New trade",
    uk: "Нова угода",
    ru: "Новая сделка",
    es: "Nuevo trade",
    fr: "Nouveau trade",
    de: "Neuer Trade",
  },
  TRADE_UPDATED: {
    it: "Trade modificato",
    en: "Trade updated",
    uk: "Угоду оновлено",
    ru: "Сделка обновлена",
    es: "Trade actualizado",
    fr: "Trade modifié",
    de: "Trade aktualisiert",
  },
  TRADE_DELETED: {
    it: "Trade eliminato",
    en: "Trade deleted",
    uk: "Угоду видалено",
    ru: "Сделка удалена",
    es: "Trade eliminado",
    fr: "Trade supprimé",
    de: "Trade gelöscht",
  },
  TRADE_IMPORTED: {
    it: "Trade importato",
    en: "Trade imported",
    uk: "Угоду імпортовано",
    ru: "Сделка импортирована",
    es: "Trade importado",
    fr: "Trade importé",
    de: "Trade importiert",
  },
  TRADE_SYNC_UPDATED: {
    it: "Trade sincronizzato",
    en: "Trade synced",
    uk: "Угоду синхронізовано",
    ru: "Сделка синхронизирована",
    es: "Trade sincronizado",
    fr: "Trade synchronisé",
    de: "Trade synchronisiert",
  },
  ACCOUNT_REVIEW_REQUESTED: {
    it: "Revisione account",
    en: "Account review",
    uk: "Перевірка акаунту",
    ru: "Проверка аккаунта",
    es: "Revisión de cuenta",
    fr: "Révision de compte",
    de: "Kontoüberprüfung",
  },
  SUPPORT_TICKET_CREATED: {
    it: "Nuovo ticket",
    en: "New ticket",
    uk: "Новий тікет",
    ru: "Новый тикет",
    es: "Nuevo ticket",
    fr: "Nouveau ticket",
    de: "Neues Ticket",
  },
  SUPPORT_TICKET_UPDATED: {
    it: "Ticket aggiornato",
    en: "Ticket updated",
    uk: "Тікет оновлено",
    ru: "Тикет обновлён",
    es: "Ticket actualizado",
    fr: "Ticket mis à jour",
    de: "Ticket aktualisiert",
  },
  MAINTENANCE_UPDATED: {
    it: "Manutenzione",
    en: "Maintenance",
    uk: "Технічне обслуговування",
    ru: "Техническое обслуживание",
    es: "Mantenimiento",
    fr: "Maintenance",
    de: "Wartung",
  },
  RELEASE_NOTE_PUBLISHED: {
    it: "Aggiornamento",
    en: "Update",
    uk: "Оновлення",
    ru: "Обновление",
    es: "Actualización",
    fr: "Mise à jour",
    de: "Update",
  },
  ACCOUNT_INVITE: {
    it: "Invito account",
    en: "Account invite",
    uk: "Запрошення до акаунту",
    ru: "Приглашение в аккаунт",
    es: "Invitación de cuenta",
    fr: "Invitation de compte",
    de: "Konto-Einladung",
  },
  ACCOUNT_INVITE_ACCEPTED: {
    it: "Invito accettato",
    en: "Invite accepted",
    uk: "Запрошення прийнято",
    ru: "Приглашение принято",
    es: "Invitación aceptada",
    fr: "Invitation acceptée",
    de: "Einladung angenommen",
  },
  ACCOUNT_INVITE_DECLINED: {
    it: "Invito non accettato",
    en: "Invite not accepted",
    uk: "Запрошення не прийнято",
    ru: "Приглашение не принято",
    es: "Invitación no aceptada",
    fr: "Invitation non acceptée",
    de: "Einladung nicht angenommen",
  },
  MEMBER_REMOVED: {
    it: "Membro rimosso",
    en: "Member removed",
    uk: "Учасника видалено",
    ru: "Участник удалён",
    es: "Miembro eliminado",
    fr: "Membre supprimé",
    de: "Mitglied entfernt",
  },
  MEMBER_ROLE_CHANGED: {
    it: "Ruolo modificato",
    en: "Role changed",
    uk: "Роль змінено",
    ru: "Роль изменена",
    es: "Rol cambiado",
    fr: "Rôle modifié",
    de: "Rolle geändert",
  },
};

export function getNotificationTypeLabel(
  type: string,
  language?: string | null
): string {
  const entry = NOTIFICATION_TYPE_LABELS[type];

  if (!entry) {
    return type;
  }

  return entry[normalizeAppLanguage(language)];
}
