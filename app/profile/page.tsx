import {
  User,
  BadgeCheck,
  Briefcase,
  Clock3,
  KeyRound,
  LineChart,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import { updateProfile } from "./actions";
import ChangePasswordForm from "./ChangePasswordForm";
import GlobalToast from "@/components/GlobalToast";

import {
  formatCurrencyByLanguage,
  formatDateByLanguage,
  formatDateTimeByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type ProfileLabels = {
  never: string;
  online: string;
  offline: string;
  complete: string;
  open: string;

  profileCenter: string;
  traderProfile: string;
  profileDescription: string;

  accounts: string;
  trades: string;
  totalPnl: string;
  winRate: string;

  lastLogin: string;
  lastActivity: string;
  logins: string;

  personalInformation: string;
  editProfile: string;
  profileImage: string;
  uploadAvatar: string;
  uploadAvatarDescription: string;
  displayName: string;
  displayNamePlaceholder: string;
  username: string;
  usernamePlaceholder: string;
  workspaceName: string;
  workspaceNamePlaceholder: string;
  timezone: string;
  bio: string;
  bioPlaceholder: string;

  tradingIdentity: string;
  tradingPreferences: string;
  tradingStyle: string;
  selectStyle: string;
  favoriteMarket: string;
  selectMarket: string;
  preferredSession: string;
  selectSession: string;
  riskPerTrade: string;
  preferredBroker: string;
  preferredBrokerPlaceholder: string;
  setupStyle: string;
  setupStylePlaceholder: string;
  saveProfile: string;

  completion: string;
  profileScore: string;
  profileCompleted: string;

  workspace: string;
  accountAccess: string;
  noLinkedAccounts: string;

  activity: string;
  recentTrades: string;
  noRecentTrades: string;

  security: string;
  changePassword: string;

  access: string;
  securityStatus: string;
  authentication: string;
  protected: string;
  accountRole: string;
};

const labels: Record<AppLanguage, ProfileLabels> = {
  it: {
    never: "Mai",
    online: "Online",
    offline: "Offline",
    complete: "Completo",
    open: "Apri",

    profileCenter: "Centro profilo",
    traderProfile: "Profilo Trader",
    profileDescription:
      "Gestisci identità, preferenze operative, stile di trading e informazioni personali usate da VOLTIS per personalizzare l’esperienza.",

    accounts: "Account",
    trades: "Trade",
    totalPnl: "PnL totale",
    winRate: "Win Rate",

    lastLogin: "Ultimo login",
    lastActivity: "Ultima attività",
    logins: "Login",

    personalInformation: "Informazioni personali",
    editProfile: "Modifica profilo",
    profileImage: "Immagine profilo",
    uploadAvatar: "Carica avatar",
    uploadAvatarDescription:
      "Carica un’immagine profilo in formato JPG, PNG o WEBP. Dimensione massima: 5MB.",
    displayName: "Nome visualizzato",
    displayNamePlaceholder: "Nome visualizzato",
    username: "Username",
    usernamePlaceholder: "Username",
    workspaceName: "Nome workspace",
    workspaceNamePlaceholder: "Nome workspace",
    timezone: "Fuso orario",
    bio: "Bio",
    bioPlaceholder:
      "Descrivi brevemente il tuo profilo da trader...",

    tradingIdentity: "Identità di trading",
    tradingPreferences: "Preferenze operative",
    tradingStyle: "Stile di trading",
    selectStyle: "Seleziona stile",
    favoriteMarket: "Mercato preferito",
    selectMarket: "Seleziona mercato",
    preferredSession: "Sessione preferita",
    selectSession: "Seleziona sessione",
    riskPerTrade: "Rischio per trade %",
    preferredBroker: "Broker preferito",
    preferredBrokerPlaceholder: "Broker / Prop Firm",
    setupStyle: "Stile setup",
    setupStylePlaceholder: "Breakout, Pullback, SMC...",
    saveProfile: "Salva profilo",

    completion: "Completamento",
    profileScore: "Punteggio profilo",
    profileCompleted: "Profilo completato",

    workspace: "Workspace",
    accountAccess: "Accesso account",
    noLinkedAccounts: "Nessun account collegato.",

    activity: "Attività",
    recentTrades: "Trade recenti",
    noRecentTrades: "Nessun trade recente.",

    security: "Sicurezza",
    changePassword: "Cambia password",

    access: "Accesso",
    securityStatus: "Stato sicurezza",
    authentication: "Autenticazione",
    protected: "Protetto",
    accountRole: "Ruolo account",
  },

  en: {
    never: "Never",
    online: "Online",
    offline: "Offline",
    complete: "Complete",
    open: "Open",

    profileCenter: "Profile Center",
    traderProfile: "Trader Profile",
    profileDescription:
      "Manage identity, operating preferences, trading style and personal information used by VOLTIS to personalize the experience.",

    accounts: "Accounts",
    trades: "Trades",
    totalPnl: "Total PnL",
    winRate: "Win Rate",

    lastLogin: "Last Login",
    lastActivity: "Last Activity",
    logins: "Logins",

    personalInformation: "Personal Information",
    editProfile: "Edit Profile",
    profileImage: "Profile Image",
    uploadAvatar: "Upload avatar",
    uploadAvatarDescription:
      "Upload a profile image in JPG, PNG or WEBP format. Maximum size: 5MB.",
    displayName: "Display Name",
    displayNamePlaceholder: "Display name",
    username: "Username",
    usernamePlaceholder: "Username",
    workspaceName: "Workspace Name",
    workspaceNamePlaceholder: "Workspace name",
    timezone: "Timezone",
    bio: "Bio",
    bioPlaceholder:
      "Briefly describe your trader profile...",

    tradingIdentity: "Trading Identity",
    tradingPreferences: "Trading Preferences",
    tradingStyle: "Trading Style",
    selectStyle: "Select style",
    favoriteMarket: "Favorite Market",
    selectMarket: "Select market",
    preferredSession: "Preferred Session",
    selectSession: "Select session",
    riskPerTrade: "Risk Per Trade %",
    preferredBroker: "Preferred Broker",
    preferredBrokerPlaceholder: "Broker / Prop Firm",
    setupStyle: "Setup Style",
    setupStylePlaceholder: "Breakout, Pullback, SMC...",
    saveProfile: "Save Profile",

    completion: "Completion",
    profileScore: "Profile Score",
    profileCompleted: "Profile completed",

    workspace: "Workspace",
    accountAccess: "Account Access",
    noLinkedAccounts: "No linked accounts.",

    activity: "Activity",
    recentTrades: "Recent Trades",
    noRecentTrades: "No recent trades.",

    security: "Security",
    changePassword: "Change password",

    access: "Access",
    securityStatus: "Security Status",
    authentication: "Authentication",
    protected: "Protected",
    accountRole: "Account Role",
  },

  uk: {
    never: "Ніколи",
    online: "Онлайн",
    offline: "Офлайн",
    complete: "Заповнено",
    open: "Відкрити",

    profileCenter: "Центр профілю",
    traderProfile: "Профіль трейдера",
    profileDescription:
      "Керуйте особистістю, операційними налаштуваннями, стилем трейдингу та персональною інформацією, яку VOLTIS використовує для персоналізації досвіду.",

    accounts: "Акаунти",
    trades: "Угоди",
    totalPnl: "Загальний PnL",
    winRate: "Win Rate",

    lastLogin: "Останній вхід",
    lastActivity: "Остання активність",
    logins: "Входи",

    personalInformation: "Особиста інформація",
    editProfile: "Редагувати профіль",
    profileImage: "Зображення профілю",
    uploadAvatar: "Завантажити аватар",
    uploadAvatarDescription:
      "Завантажте зображення профілю у форматі JPG, PNG або WEBP. Максимальний розмір: 5MB.",
    displayName: "Відображуване ім’я",
    displayNamePlaceholder: "Відображуване ім’я",
    username: "Ім’я користувача",
    usernamePlaceholder: "Ім’я користувача",
    workspaceName: "Назва workspace",
    workspaceNamePlaceholder: "Назва workspace",
    timezone: "Часовий пояс",
    bio: "Біо",
    bioPlaceholder:
      "Коротко опишіть свій профіль трейдера...",

    tradingIdentity: "Трейдингова ідентичність",
    tradingPreferences: "Операційні налаштування",
    tradingStyle: "Стиль трейдингу",
    selectStyle: "Виберіть стиль",
    favoriteMarket: "Улюблений ринок",
    selectMarket: "Виберіть ринок",
    preferredSession: "Бажана сесія",
    selectSession: "Виберіть сесію",
    riskPerTrade: "Ризик на угоду %",
    preferredBroker: "Бажаний брокер",
    preferredBrokerPlaceholder: "Брокер / Prop Firm",
    setupStyle: "Стиль сетапу",
    setupStylePlaceholder: "Breakout, Pullback, SMC...",
    saveProfile: "Зберегти профіль",

    completion: "Заповнення",
    profileScore: "Оцінка профілю",
    profileCompleted: "Профіль заповнено",

    workspace: "Workspace",
    accountAccess: "Доступ до акаунтів",
    noLinkedAccounts: "Немає підключених акаунтів.",

    activity: "Активність",
    recentTrades: "Останні угоди",
    noRecentTrades: "Немає останніх угод.",

    security: "Безпека",
    changePassword: "Змінити пароль",

    access: "Доступ",
    securityStatus: "Статус безпеки",
    authentication: "Аутентифікація",
    protected: "Захищено",
    accountRole: "Роль акаунта",
  },

  ru: {
    never: "Никогда",
    online: "Онлайн",
    offline: "Офлайн",
    complete: "Заполнено",
    open: "Открыть",

    profileCenter: "Центр профиля",
    traderProfile: "Профиль трейдера",
    profileDescription:
      "Управляйте личностью, операционными настройками, стилем трейдинга и персональной информацией, которую VOLTIS использует для персонализации опыта.",

    accounts: "Аккаунты",
    trades: "Сделки",
    totalPnl: "Общий PnL",
    winRate: "Win Rate",

    lastLogin: "Последний вход",
    lastActivity: "Последняя активность",
    logins: "Входы",

    personalInformation: "Личная информация",
    editProfile: "Редактировать профиль",
    profileImage: "Изображение профиля",
    uploadAvatar: "Загрузить аватар",
    uploadAvatarDescription:
      "Загрузите изображение профиля в формате JPG, PNG или WEBP. Максимальный размер: 5MB.",
    displayName: "Отображаемое имя",
    displayNamePlaceholder: "Отображаемое имя",
    username: "Имя пользователя",
    usernamePlaceholder: "Имя пользователя",
    workspaceName: "Название workspace",
    workspaceNamePlaceholder: "Название workspace",
    timezone: "Часовой пояс",
    bio: "Био",
    bioPlaceholder:
      "Кратко опишите свой профиль трейдера...",

    tradingIdentity: "Трейдинговая идентичность",
    tradingPreferences: "Операционные настройки",
    tradingStyle: "Стиль трейдинга",
    selectStyle: "Выберите стиль",
    favoriteMarket: "Любимый рынок",
    selectMarket: "Выберите рынок",
    preferredSession: "Предпочитаемая сессия",
    selectSession: "Выберите сессию",
    riskPerTrade: "Риск на сделку %",
    preferredBroker: "Предпочитаемый брокер",
    preferredBrokerPlaceholder: "Брокер / Prop Firm",
    setupStyle: "Стиль сетапа",
    setupStylePlaceholder: "Breakout, Pullback, SMC...",
    saveProfile: "Сохранить профиль",

    completion: "Заполнение",
    profileScore: "Оценка профиля",
    profileCompleted: "Профиль заполнен",

    workspace: "Workspace",
    accountAccess: "Доступ к аккаунтам",
    noLinkedAccounts: "Нет подключенных аккаунтов.",

    activity: "Активность",
    recentTrades: "Последние сделки",
    noRecentTrades: "Нет последних сделок.",

    security: "Безопасность",
    changePassword: "Изменить пароль",

    access: "Доступ",
    securityStatus: "Статус безопасности",
    authentication: "Аутентификация",
    protected: "Защищено",
    accountRole: "Роль аккаунта",
  },

  es: {
    never: "Nunca",
    online: "Online",
    offline: "Offline",
    complete: "Completo",
    open: "Abrir",

    profileCenter: "Centro de perfil",
    traderProfile: "Perfil del trader",
    profileDescription:
      "Gestiona identidad, preferencias operativas, estilo de trading e información personal usada por VOLTIS para personalizar la experiencia.",

    accounts: "Cuentas",
    trades: "Trades",
    totalPnl: "PnL total",
    winRate: "Win Rate",

    lastLogin: "Último login",
    lastActivity: "Última actividad",
    logins: "Logins",

    personalInformation: "Información personal",
    editProfile: "Editar perfil",
    profileImage: "Imagen de perfil",
    uploadAvatar: "Subir avatar",
    uploadAvatarDescription:
      "Sube una imagen de perfil en formato JPG, PNG o WEBP. Tamaño máximo: 5MB.",
    displayName: "Nombre visible",
    displayNamePlaceholder: "Nombre visible",
    username: "Usuario",
    usernamePlaceholder: "Usuario",
    workspaceName: "Nombre del workspace",
    workspaceNamePlaceholder: "Nombre del workspace",
    timezone: "Zona horaria",
    bio: "Bio",
    bioPlaceholder:
      "Describe brevemente tu perfil como trader...",

    tradingIdentity: "Identidad de trading",
    tradingPreferences: "Preferencias operativas",
    tradingStyle: "Estilo de trading",
    selectStyle: "Selecciona estilo",
    favoriteMarket: "Mercado favorito",
    selectMarket: "Selecciona mercado",
    preferredSession: "Sesión preferida",
    selectSession: "Selecciona sesión",
    riskPerTrade: "Riesgo por trade %",
    preferredBroker: "Broker preferido",
    preferredBrokerPlaceholder: "Broker / Prop Firm",
    setupStyle: "Estilo de setup",
    setupStylePlaceholder: "Breakout, Pullback, SMC...",
    saveProfile: "Guardar perfil",

    completion: "Completado",
    profileScore: "Puntuación del perfil",
    profileCompleted: "Perfil completado",

    workspace: "Workspace",
    accountAccess: "Acceso a cuentas",
    noLinkedAccounts: "No hay cuentas vinculadas.",

    activity: "Actividad",
    recentTrades: "Trades recientes",
    noRecentTrades: "No hay trades recientes.",

    security: "Seguridad",
    changePassword: "Cambiar contraseña",

    access: "Acceso",
    securityStatus: "Estado de seguridad",
    authentication: "Autenticación",
    protected: "Protegido",
    accountRole: "Rol de cuenta",
  },

  fr: {
    never: "Jamais",
    online: "En ligne",
    offline: "Hors ligne",
    complete: "Complet",
    open: "Ouvrir",

    profileCenter: "Centre du profil",
    traderProfile: "Profil trader",
    profileDescription:
      "Gérez l’identité, les préférences opérationnelles, le style de trading et les informations personnelles utilisées par VOLTIS pour personnaliser l’expérience.",

    accounts: "Comptes",
    trades: "Trades",
    totalPnl: "PnL total",
    winRate: "Win Rate",

    lastLogin: "Dernière connexion",
    lastActivity: "Dernière activité",
    logins: "Connexions",

    personalInformation: "Informations personnelles",
    editProfile: "Modifier le profil",
    profileImage: "Image de profil",
    uploadAvatar: "Téléverser un avatar",
    uploadAvatarDescription:
      "Téléversez une image de profil au format JPG, PNG ou WEBP. Taille maximale : 5MB.",
    displayName: "Nom affiché",
    displayNamePlaceholder: "Nom affiché",
    username: "Nom d’utilisateur",
    usernamePlaceholder: "Nom d’utilisateur",
    workspaceName: "Nom du workspace",
    workspaceNamePlaceholder: "Nom du workspace",
    timezone: "Fuseau horaire",
    bio: "Bio",
    bioPlaceholder:
      "Décrivez brièvement votre profil de trader...",

    tradingIdentity: "Identité de trading",
    tradingPreferences: "Préférences opérationnelles",
    tradingStyle: "Style de trading",
    selectStyle: "Sélectionner un style",
    favoriteMarket: "Marché préféré",
    selectMarket: "Sélectionner un marché",
    preferredSession: "Session préférée",
    selectSession: "Sélectionner une session",
    riskPerTrade: "Risque par trade %",
    preferredBroker: "Broker préféré",
    preferredBrokerPlaceholder: "Broker / Prop Firm",
    setupStyle: "Style de setup",
    setupStylePlaceholder: "Breakout, Pullback, SMC...",
    saveProfile: "Enregistrer le profil",

    completion: "Complétion",
    profileScore: "Score du profil",
    profileCompleted: "Profil complété",

    workspace: "Workspace",
    accountAccess: "Accès aux comptes",
    noLinkedAccounts: "Aucun compte lié.",

    activity: "Activité",
    recentTrades: "Trades récents",
    noRecentTrades: "Aucun trade récent.",

    security: "Sécurité",
    changePassword: "Changer le mot de passe",

    access: "Accès",
    securityStatus: "Statut de sécurité",
    authentication: "Authentification",
    protected: "Protégé",
    accountRole: "Rôle du compte",
  },

  de: {
    never: "Nie",
    online: "Online",
    offline: "Offline",
    complete: "Vollständig",
    open: "Öffnen",

    profileCenter: "Profil-Center",
    traderProfile: "Trader-Profil",
    profileDescription:
      "Verwalte Identität, operative Präferenzen, Trading-Stil und persönliche Informationen, die VOLTIS zur Personalisierung der Erfahrung nutzt.",

    accounts: "Konten",
    trades: "Trades",
    totalPnl: "Gesamt-PnL",
    winRate: "Win Rate",

    lastLogin: "Letzter Login",
    lastActivity: "Letzte Aktivität",
    logins: "Logins",

    personalInformation: "Persönliche Informationen",
    editProfile: "Profil bearbeiten",
    profileImage: "Profilbild",
    uploadAvatar: "Avatar hochladen",
    uploadAvatarDescription:
      "Lade ein Profilbild im JPG-, PNG- oder WEBP-Format hoch. Maximale Größe: 5MB.",
    displayName: "Anzeigename",
    displayNamePlaceholder: "Anzeigename",
    username: "Benutzername",
    usernamePlaceholder: "Benutzername",
    workspaceName: "Workspace-Name",
    workspaceNamePlaceholder: "Workspace-Name",
    timezone: "Zeitzone",
    bio: "Bio",
    bioPlaceholder:
      "Beschreibe kurz dein Trader-Profil...",

    tradingIdentity: "Trading-Identität",
    tradingPreferences: "Operative Präferenzen",
    tradingStyle: "Trading-Stil",
    selectStyle: "Stil auswählen",
    favoriteMarket: "Bevorzugter Markt",
    selectMarket: "Markt auswählen",
    preferredSession: "Bevorzugte Session",
    selectSession: "Session auswählen",
    riskPerTrade: "Risiko pro Trade %",
    preferredBroker: "Bevorzugter Broker",
    preferredBrokerPlaceholder: "Broker / Prop Firm",
    setupStyle: "Setup-Stil",
    setupStylePlaceholder: "Breakout, Pullback, SMC...",
    saveProfile: "Profil speichern",

    completion: "Vollständigkeit",
    profileScore: "Profil-Score",
    profileCompleted: "Profil vervollständigt",

    workspace: "Workspace",
    accountAccess: "Kontozugriff",
    noLinkedAccounts: "Keine verknüpften Konten.",

    activity: "Aktivität",
    recentTrades: "Aktuelle Trades",
    noRecentTrades: "Keine aktuellen Trades.",

    security: "Sicherheit",
    changePassword: "Passwort ändern",

    access: "Zugriff",
    securityStatus: "Sicherheitsstatus",
    authentication: "Authentifizierung",
    protected: "Geschützt",
    accountRole: "Kontorolle",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isOnline(date?: Date | null) {
  if (!date) {
    return false;
  }

  return Date.now() - new Date(date).getTime() < 5 * 60 * 1000;
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{
    toast?: string;
  }>;
}) {
  const query = await searchParams;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },

    include: {
      memberships: {
        include: {
          tradingAccount: {
            include: {
              trades: true,
              members: true,
            },
          },
        },
      },

      createdTrades: {
        orderBy: {
          openDate: "desc",
        },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const appLanguage = normalizeAppLanguage(user.appLanguage);
  const t = labels[appLanguage];
  const currency = user.defaultCurrency ?? "USD";

  const displayName = user.name || user.username;
  const initials = getInitials(displayName);

  const accounts = user.memberships.map(
    (membership) => membership.tradingAccount
  );

  const allTrades = accounts.flatMap(
    (account) => account.trades
  );

  const totalAccounts = accounts.length;
  const totalTrades = allTrades.length;

  const totalPnl = allTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const wins = allTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const winRate =
    totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  const online = isOnline(user.lastActivityAt);

  const profileCompletionItems = [
    user.name,
    user.username,
    user.bio,
    user.workspaceName,
    user.tradingStyle,
    user.favoriteMarket,
    user.timezone,
    user.preferredSession,
    user.riskPerTrade,
    user.preferredBroker,
    user.setupStyle,
  ];

  const completedProfileItems =
    profileCompletionItems.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedProfileItems / profileCompletionItems.length) *
    100
  );

  const formatCurrency = (value: number) =>
    formatCurrencyByLanguage(
      value,
      currency,
      appLanguage
    );

  const formatDateTime = (date?: Date | null) => {
    if (!date) {
      return t.never;
    }

    return formatDateTimeByLanguage(
      date,
      appLanguage
    );
  };

  const formatShortDate = (date: Date) =>
    formatDateByLanguage(
      date,
      appLanguage
    );

  const statCards = [
    {
      label: t.accounts,
      value: totalAccounts,
      tone: "text-white",
      icon: Wallet,
    },
    {
      label: t.trades,
      value: totalTrades,
      tone: "text-white",
      icon: LineChart,
    },
    {
      label: t.totalPnl,
      value: formatCurrency(totalPnl),
      tone:
        totalPnl >= 0
          ? "text-accent"
          : "text-red-400",
      icon: TrendingUp,
    },
    {
      label: t.winRate,
      value: `${winRate.toFixed(2)}%`,
      tone:
        winRate >= 50
          ? "text-accent"
          : "text-red-400",
      icon: Target,
    },
  ];

  return (
    <div className="space-y-12">
      <GlobalToast status={query.toast} />

      <div>
        <p className="text-sm text-accent">
          {t.profileCenter}
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <User className="text-accent" />
          {t.traderProfile}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          {t.profileDescription}
        </p>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border border-green-500/20 bg-accent/10">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-3xl font-black text-accent">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-black text-white">
                  {displayName}
                </h2>

                <span
                  className={`rounded-xl px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${online
                      ? "bg-accent/10 text-accent"
                      : "bg-white/10 text-gray-400"
                    }`}
                >
                  {online ? t.online : t.offline}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-400">
                @{user.username}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                  {user.role}
                </span>

                <span className="rounded-xl bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  {profileCompletion}% {t.complete}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500">
                {t.lastLogin}
              </p>

              <h3 className="mt-2 text-sm font-bold text-white">
                {formatDateTime(user.lastLoginAt)}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500">
                {t.lastActivity}
              </p>

              <h3 className="mt-2 text-sm font-bold text-white">
                {formatDateTime(user.lastActivityAt)}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500">
                {t.logins}
              </p>

              <h3 className="mt-2 text-sm font-bold text-white">
                {user.loginCount}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-accent">
                <Icon size={20} />
              </div>

              <p className="text-sm text-gray-400">
                {card.label}
              </p>

              <h2 className={`mt-2 text-2xl font-black ${card.tone}`}>
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <form
          action={updateProfile}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              {t.personalInformation}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {t.editProfile}
            </h2>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                {t.profileImage}
              </p>

              <h3 className="mt-2 text-lg font-bold">
                {t.uploadAvatar}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t.uploadAvatarDescription}
              </p>

              <input
                type="file"
                name="profileImage"
                accept="image/jpeg,image/png,image/webp"
                className="mt-4 w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-sm text-gray-300 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-accent-bright"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.displayName}
              </p>

              <input
                name="name"
                defaultValue={user.name || ""}
                placeholder={t.displayNamePlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.username}
              </p>

              <input
                name="username"
                defaultValue={user.username}
                placeholder={t.usernamePlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                required
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.workspaceName}
              </p>

              <input
                name="workspaceName"
                defaultValue={user.workspaceName || ""}
                placeholder={t.workspaceNamePlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.timezone}
              </p>

              <input
                name="timezone"
                defaultValue={user.timezone || ""}
                placeholder="Europe/Rome"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-sm text-gray-400">
                {t.bio}
              </p>

              <textarea
                name="bio"
                defaultValue={user.bio || ""}
                placeholder={t.bioPlaceholder}
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-400">
              {t.tradingIdentity}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {t.tradingPreferences}
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.tradingStyle}
              </p>

              <select
                name="tradingStyle"
                defaultValue={user.tradingStyle || ""}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="">
                  {t.selectStyle}
                </option>

                <option value="Scalping">
                  Scalping
                </option>

                <option value="Day Trading">
                  Day Trading
                </option>

                <option value="Swing Trading">
                  Swing Trading
                </option>

                <option value="Position Trading">
                  Position Trading
                </option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.favoriteMarket}
              </p>

              <select
                name="favoriteMarket"
                defaultValue={user.favoriteMarket || ""}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="">
                  {t.selectMarket}
                </option>

                <option value="Forex">
                  Forex
                </option>

                <option value="Gold">
                  Gold
                </option>

                <option value="Crypto">
                  Crypto
                </option>

                <option value="Indices">
                  Indices
                </option>

                <option value="Commodities">
                  Commodities
                </option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.preferredSession}
              </p>

              <select
                name="preferredSession"
                defaultValue={user.preferredSession || ""}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="">
                  {t.selectSession}
                </option>

                <option value="Asia">
                  Asia
                </option>

                <option value="London">
                  London
                </option>

                <option value="New York">
                  New York
                </option>

                <option value="Overlap">
                  Overlap
                </option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.riskPerTrade}
              </p>

              <input
                name="riskPerTrade"
                type="number"
                step="0.01"
                defaultValue={user.riskPerTrade ?? ""}
                placeholder="1"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.preferredBroker}
              </p>

              <input
                name="preferredBroker"
                defaultValue={user.preferredBroker || ""}
                placeholder={t.preferredBrokerPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.setupStyle}
              </p>

              <input
                name="setupStyle"
                defaultValue={user.setupStyle || ""}
                placeholder={t.setupStylePlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-accent px-6 py-4 font-bold text-white transition hover:bg-accent-bright"
          >
            {t.saveProfile}
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <BadgeCheck
                size={22}
                className="text-accent"
              />

              <div>
                <p className="text-sm text-gray-400">
                  {t.completion}
                </p>

                <h2 className="text-2xl font-bold">
                  {t.profileScore}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                {t.profileCompleted}
              </p>

              <h3 className="mt-2 text-4xl font-black text-accent">
                {profileCompletion}%
              </h3>

              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{
                    width: `${profileCompletion}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Briefcase
                size={22}
                className="text-accent"
              />

              <div>
                <p className="text-sm text-gray-400">
                  {t.workspace}
                </p>

                <h2 className="text-2xl font-bold">
                  {t.accountAccess}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {user.memberships.length > 0 ? (
                user.memberships.map((membership) => (
                  <Link
                    key={membership.id}
                    href={`/accounts/${membership.tradingAccount.id}`}
                    className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          {membership.tradingAccount.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {membership.tradingAccount.type} · {membership.role}
                        </p>
                      </div>

                      <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                        {t.open}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-400">
                  {t.noLinkedAccounts}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Clock3
                size={22}
                className="text-accent"
              />

              <div>
                <p className="text-sm text-gray-400">
                  {t.activity}
                </p>

                <h2 className="text-2xl font-bold">
                  {t.recentTrades}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {user.createdTrades.length > 0 ? (
                user.createdTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          {trade.symbol}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatShortDate(trade.openDate)}
                        </p>
                      </div>

                      <span
                        className={`rounded-xl px-3 py-1 text-xs font-bold ${(trade.resultUsd || 0) >= 0
                            ? "bg-accent/10 text-accent"
                            : "bg-red-500/10 text-red-400"
                          }`}
                      >
                        {formatCurrency(trade.resultUsd || 0)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-400">
                  {t.noRecentTrades}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <KeyRound
                size={22}
                className="text-accent"
              />

              <div>
                <p className="text-sm text-gray-400">
                  {t.security}
                </p>

                <h2 className="text-2xl font-bold">
                  {t.changePassword}
                </h2>
              </div>
            </div>

            <ChangePasswordForm appLanguage={appLanguage} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Shield
                size={22}
                className="text-accent"
              />

              <div>
                <p className="text-sm text-gray-400">
                  {t.access}
                </p>

                <h2 className="text-2xl font-bold">
                  {t.securityStatus}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-gray-400">
                  {t.authentication}
                </p>

                <h3 className="mt-1 font-bold text-white">
                  {t.protected}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-gray-400">
                  {t.accountRole}
                </p>

                <h3 className="mt-1 font-bold text-white">
                  {user.role}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

