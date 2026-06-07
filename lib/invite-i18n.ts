import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";

const ROLE_NAMES: Record<string, Record<AppLanguage, string>> = {
  MANAGER: {
    it: "Manager",
    en: "Manager",
    uk: "Менеджер",
    ru: "Менеджер",
    es: "Manager",
    fr: "Manager",
    de: "Manager",
  },
  MEMBER: {
    it: "Membro",
    en: "Member",
    uk: "Учасник",
    ru: "Участник",
    es: "Miembro",
    fr: "Membre",
    de: "Mitglied",
  },
  VIEWER: {
    it: "Osservatore",
    en: "Viewer",
    uk: "Спостерігач",
    ru: "Наблюдатель",
    es: "Observador",
    fr: "Observateur",
    de: "Beobachter",
  },
};

// ─── ACCOUNT_INVITE ───────────────────────────────────────────────────────────

const INVITE_TITLES: Record<AppLanguage, string> = {
  it: "Invito a un account VOLTIS",
  en: "VOLTIS account invitation",
  uk: "Запрошення до акаунту VOLTIS",
  ru: "Приглашение в аккаунт VOLTIS",
  es: "Invitación a cuenta VOLTIS",
  fr: "Invitation à un compte VOLTIS",
  de: "VOLTIS-Konto-Einladung",
};

const INVITE_BODIES: Record<
  AppLanguage,
  (name: string, account: string, role: string) => string
> = {
  it: (name, account, role) =>
    `${name} ti ha invitato a collaborare nell'account «${account}» come ${role}.`,
  en: (name, account, role) =>
    `${name} has invited you to collaborate in account «${account}» as ${role}.`,
  uk: (name, account, role) =>
    `${name} запросив вас до акаунту «${account}» з роллю ${role}.`,
  ru: (name, account, role) =>
    `${name} пригласил вас в аккаунт «${account}» с ролью ${role}.`,
  es: (name, account, role) =>
    `${name} te ha invitado a colaborar en la cuenta «${account}» como ${role}.`,
  fr: (name, account, role) =>
    `${name} vous a invité à collaborer dans le compte «${account}» en tant que ${role}.`,
  de: (name, account, role) =>
    `${name} hat dich eingeladen, im Konto «${account}» als ${role} mitzuwirken.`,
};

export function buildInviteNotification(
  recipientLanguage: string | null | undefined,
  inviterName: string,
  accountName: string,
  role: string
): { title: string; message: string } {
  const lang = normalizeAppLanguage(recipientLanguage);
  const roleName = ROLE_NAMES[role]?.[lang] ?? role;
  return {
    title: INVITE_TITLES[lang],
    message: INVITE_BODIES[lang](inviterName, accountName, roleName),
  };
}

// ─── ACCOUNT_INVITE_ACCEPTED ──────────────────────────────────────────────────

const INVITE_ACCEPTED_TITLES: Record<AppLanguage, string> = {
  it: "Invito accettato",
  en: "Invite accepted",
  uk: "Запрошення прийнято",
  ru: "Приглашение принято",
  es: "Invitación aceptada",
  fr: "Invitation acceptée",
  de: "Einladung angenommen",
};

const INVITE_ACCEPTED_BODIES: Record<
  AppLanguage,
  (username: string, account: string) => string
> = {
  it: (username, account) =>
    `${username} ha accettato il tuo invito e si è unito all'account «${account}».`,
  en: (username, account) =>
    `${username} accepted your invite and joined account «${account}».`,
  uk: (username, account) =>
    `${username} прийняв ваше запрошення та приєднався до акаунту «${account}».`,
  ru: (username, account) =>
    `${username} принял ваше приглашение и присоединился к аккаунту «${account}».`,
  es: (username, account) =>
    `${username} aceptó tu invitación y se unió a la cuenta «${account}».`,
  fr: (username, account) =>
    `${username} a accepté votre invitation et a rejoint le compte «${account}».`,
  de: (username, account) =>
    `${username} hat deine Einladung angenommen und ist dem Konto «${account}» beigetreten.`,
};

export function buildInviteAcceptedNotification(
  recipientLanguage: string | null | undefined,
  invitedUsername: string,
  accountName: string
): { title: string; message: string } {
  const lang = normalizeAppLanguage(recipientLanguage);
  return {
    title: INVITE_ACCEPTED_TITLES[lang],
    message: INVITE_ACCEPTED_BODIES[lang](invitedUsername, accountName),
  };
}

// ─── ACCOUNT_INVITE_DECLINED ──────────────────────────────────────────────────

const INVITE_DECLINED_TITLES: Record<AppLanguage, string> = {
  it: "Invito non accettato",
  en: "Invite not accepted",
  uk: "Запрошення не прийнято",
  ru: "Приглашение не принято",
  es: "Invitación no aceptada",
  fr: "Invitation non acceptée",
  de: "Einladung nicht angenommen",
};

const INVITE_DECLINED_BODIES: Record<
  AppLanguage,
  (username: string, account: string) => string
> = {
  it: (username, account) =>
    `Il tuo invito a ${username} per l'account «${account}» non è stato accettato.`,
  en: (username, account) =>
    `Your invite to ${username} for account «${account}» was not accepted.`,
  uk: (username, account) =>
    `Ваше запрошення для ${username} до акаунту «${account}» не було прийнято.`,
  ru: (username, account) =>
    `Ваше приглашение для ${username} в аккаунт «${account}» не было принято.`,
  es: (username, account) =>
    `Tu invitación a ${username} para la cuenta «${account}» no fue aceptada.`,
  fr: (username, account) =>
    `Votre invitation à ${username} pour le compte «${account}» n'a pas été acceptée.`,
  de: (username, account) =>
    `Deine Einladung an ${username} für das Konto «${account}» wurde nicht angenommen.`,
};

export function buildInviteDeclinedNotification(
  recipientLanguage: string | null | undefined,
  invitedUsername: string,
  accountName: string
): { title: string; message: string } {
  const lang = normalizeAppLanguage(recipientLanguage);
  return {
    title: INVITE_DECLINED_TITLES[lang],
    message: INVITE_DECLINED_BODIES[lang](invitedUsername, accountName),
  };
}
