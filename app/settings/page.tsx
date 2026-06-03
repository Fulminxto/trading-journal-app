import {
  Settings,
  Palette,
  Bell,
  Download,
  ShieldAlert,
  LifeBuoy,
  BookOpen,
  Globe,
  Smartphone,
} from "lucide-react";

import { redirect } from "next/navigation";

import GlobalToast from "@/components/GlobalToast";
import ReopenOnboardingButton from "@/components/ReopenOnboardingButton";
import SettingsHardRefresh from "@/components/SettingsHardRefresh";
import { auth } from "@/lib/auth";
import {
  LANGUAGE_OPTIONS,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

import { updateSettings } from "./actions";

type SettingsLabels = {
  platformEyebrow: string;
  title: string;
  description: string;

  languageEyebrow: string;
  languageTitle: string;
  languageDescription: string;
  appLanguageLabel: string;
  appLanguageHint: string;
  defaultCurrencyLabel: string;

  appearanceEyebrow: string;
  appearanceTitle: string;
  themeLabel: string;
  themeTitle: string;
  themeDescription: string;
  accentLabel: string;
  accentTitle: string;
  accentDescription: string;
  compactLabel: string;
  compactTitle: string;
  compactDescription: string;
  blurLabel: string;
  blurTitle: string;
  blurDescription: string;

  appExperienceEyebrow: string;
  appExperienceTitle: string;
  iconVariantLabel: string;
  iconVariantTitle: string;
  iconVariantDescription: string;
  pwaStatusLabel: string;
  pwaStatusValue: string;
  pwaStatusDescription: string;

  notificationsEyebrow: string;
  notificationsTitle: string;
  inAppNotificationsLabel: string;
  inAppNotificationsValue: string;
  inAppNotificationsDescription: string;
  activeBadge: string;
  reviewRemindersLabel: string;
  reviewRemindersDescription: string;
  sessionLockAlertsLabel: string;
  sessionLockAlertsDescription: string;
  dailyReminderLabel: string;
  dailyReminderDescription: string;
  enabled: string;
  disabled: string;

  saveSettings: string;

  backupEyebrow: string;
  backupTitle: string;
  backupDescription: string;
  exportTradesLabel: string;
  exportTradesTitle: string;
  exportTradesDescription: string;
  cloudBackupLabel: string;
  cloudBackupTitle: string;
  cloudBackupDescription: string;

  securityEyebrow: string;
  securityTitle: string;
  authenticationLabel: string;
  authenticationValue: string;
  authenticationDescription: string;
  sessionStatusLabel: string;
  sessionStatusValue: string;
  sessionStatusDescription: string;

  onboardingEyebrow: string;
  onboardingTitle: string;
  onboardingDescription: string;

  supportEyebrow: string;
  supportTitle: string;
  documentationLabel: string;
  documentationTitle: string;
  documentationDescription: string;
  communityLabel: string;
  communityTitle: string;
  communityDescription: string;

  dangerEyebrow: string;
  dangerTitle: string;
  dangerDescription: string;
  resetLabel: string;
  resetTitle: string;
  resetDescription: string;
  deleteLabel: string;
  deleteTitle: string;
  deleteDescription: string;

  statusEyebrow: string;
  statusTitle: string;
  statusDescription: string;
};

const settingsLabels: Record<AppLanguage, SettingsLabels> = {
  it: {
    platformEyebrow: "Impostazioni piattaforma",
    title: "Settings",
    description: "Gestisci preferenze, notifiche interne, sicurezza, lingua, aspetto e configurazione dell’app.",
    languageEyebrow: "Lingua",
    languageTitle: "Lingua & Localizzazione",
    languageDescription: "Configura lingua dell’app e valuta predefinita.",
    appLanguageLabel: "Lingua dell’app",
    appLanguageHint: "La struttura multilingua è pronta. Ogni nuova pagina verrà chiusa subito in tutte le lingue supportate.",
    defaultCurrencyLabel: "Valuta predefinita",
    appearanceEyebrow: "Aspetto",
    appearanceTitle: "Tema & UI",
    themeLabel: "Tema",
    themeTitle: "Modalità interfaccia",
    themeDescription: "Scegli la modalità visiva dell’app.",
    accentLabel: "Colore principale",
    accentTitle: "Identità visiva",
    accentDescription: "Colore principale della piattaforma.",
    compactLabel: "Modalità compatta",
    compactTitle: "Layout minimale",
    compactDescription: "Riduce la densità visiva dell’interfaccia.",
    blurLabel: "Nascondi performance",
    blurTitle: "Proteggi i valori",
    blurDescription: "Nasconde valori sensibili durante l’utilizzo.",
    appExperienceEyebrow: "Esperienza app",
    appExperienceTitle: "Icona & Installazione",
    iconVariantLabel: "Variante icona app",
    iconVariantTitle: "Stile schermata home",
    iconVariantDescription: "Scegli la variante dell’icona dell’app. La PWA userà questa preferenza nella fase finale.",
    pwaStatusLabel: "Stato PWA",
    pwaStatusValue: "Pianificato",
    pwaStatusDescription: "L’installazione come app su desktop, mobile e tablet verrà completata nel blocco PWA.",
    notificationsEyebrow: "Notifiche",
    notificationsTitle: "Avvisi in-app",
    inAppNotificationsLabel: "Notifiche in-app",
    inAppNotificationsValue: "Attive",
    inAppNotificationsDescription: "Tutte le notifiche importanti arrivano direttamente dentro VOLTIS tramite il Notification Center.",
    activeBadge: "Attivo",
    reviewRemindersLabel: "Reminder review",
    reviewRemindersDescription: "Alert per review operative obbligatorie.",
    sessionLockAlertsLabel: "Alert blocco sessione",
    sessionLockAlertsDescription: "Notifiche quando il rischio operativo è elevato.",
    dailyReminderLabel: "Reminder giornaliero",
    dailyReminderDescription: "Promemoria quotidiano per completare il diario operativo.",
    enabled: "Attivo",
    disabled: "Disattivo",
    saveSettings: "Salva impostazioni",
    backupEyebrow: "Backup",
    backupTitle: "Gestione dati",
    backupDescription: "Backup, export e protezione dati. Il backup manuale Supabase è documentato e disponibile tramite script locale.",
    exportTradesLabel: "Export trade",
    exportTradesTitle: "CSV Export",
    exportTradesDescription: "Funzione prevista per esportare i trade in formato CSV.",
    cloudBackupLabel: "Cloud backup",
    cloudBackupTitle: "Sincronizzato",
    cloudBackupDescription: "La procedura di backup manuale protegge i dati del database.",
    securityEyebrow: "Sicurezza",
    securityTitle: "Protezione account",
    authenticationLabel: "Autenticazione",
    authenticationValue: "Protetto",
    authenticationDescription: "Accesso protetto tramite credenziali.",
    sessionStatusLabel: "Stato sessione",
    sessionStatusValue: "Attiva",
    sessionStatusDescription: "Sessione attiva sul dispositivo corrente.",
    onboardingEyebrow: "Onboarding",
    onboardingTitle: "Riapri tutorial",
    onboardingDescription: "Vuoi rivedere il tutorial iniziale e il manifesto VOLTIS?",
    supportEyebrow: "Supporto",
    supportTitle: "Centro assistenza",
    documentationLabel: "Documentazione",
    documentationTitle: "VOLTIS Docs",
    documentationDescription: "Area prevista per documentazione, procedure e guide interne.",
    communityLabel: "Community",
    communityTitle: "Private Traders Hub",
    communityDescription: "Area privata prevista per trader selezionati.",
    dangerEyebrow: "Danger zone",
    dangerTitle: "Azioni critiche",
    dangerDescription: "Queste azioni sono disabilitate finché non sarà pronta una procedura sicura.",
    resetLabel: "Reset preferenze",
    resetTitle: "Ripristina impostazioni",
    resetDescription: "Azione disabilitata per evitare modifiche accidentali.",
    deleteLabel: "Elimina account",
    deleteTitle: "Rimozione permanente",
    deleteDescription: "Azione disabilitata per proteggere dati e accessi.",
    statusEyebrow: "Stato",
    statusTitle: "Settings Center pronto",
    statusDescription: "La base è pronta per multilingua completo, PWA, onboarding premium e rebranding finale.",
  },
  en: {
    platformEyebrow: "Platform settings",
    title: "Settings",
    description: "Manage preferences, internal notifications, security, language, appearance and app configuration.",
    languageEyebrow: "Language",
    languageTitle: "Language & Localization",
    languageDescription: "Configure the app language and default currency.",
    appLanguageLabel: "App language",
    appLanguageHint: "The multilingual structure is ready. Every new page will be completed immediately in all supported languages.",
    defaultCurrencyLabel: "Default currency",
    appearanceEyebrow: "Appearance",
    appearanceTitle: "Theme & UI",
    themeLabel: "Theme",
    themeTitle: "Interface mode",
    themeDescription: "Choose the visual mode of the app.",
    accentLabel: "Accent color",
    accentTitle: "Visual identity",
    accentDescription: "Main color of the platform.",
    compactLabel: "Compact mode",
    compactTitle: "Minimal layout",
    compactDescription: "Reduces the visual density of the interface.",
    blurLabel: "Performance blur",
    blurTitle: "Hide balances",
    blurDescription: "Hides sensitive values while using the app.",
    appExperienceEyebrow: "App experience",
    appExperienceTitle: "Icon & Installation",
    iconVariantLabel: "App icon variant",
    iconVariantTitle: "Home screen style",
    iconVariantDescription: "Choose the app icon variant. The PWA will use this preference in the final phase.",
    pwaStatusLabel: "PWA status",
    pwaStatusValue: "Planned",
    pwaStatusDescription: "Installation as an app on desktop, mobile and tablet will be completed in the PWA block.",
    notificationsEyebrow: "Notifications",
    notificationsTitle: "In-app alerts",
    inAppNotificationsLabel: "In-app notifications",
    inAppNotificationsValue: "Enabled",
    inAppNotificationsDescription: "All important notifications arrive directly inside VOLTIS through the Notification Center.",
    activeBadge: "Active",
    reviewRemindersLabel: "Review reminders",
    reviewRemindersDescription: "Alerts for required operational reviews.",
    sessionLockAlertsLabel: "Session lock alerts",
    sessionLockAlertsDescription: "Notifications for elevated operational risk.",
    dailyReminderLabel: "Daily reminder",
    dailyReminderDescription: "Daily reminder to complete trading records.",
    enabled: "Enabled",
    disabled: "Disabled",
    saveSettings: "Save settings",
    backupEyebrow: "Backup",
    backupTitle: "Data management",
    backupDescription: "Backup, export and data protection. The manual Supabase backup is documented and available through a local script.",
    exportTradesLabel: "Export trades",
    exportTradesTitle: "CSV Export",
    exportTradesDescription: "Planned function to export trades in CSV format.",
    cloudBackupLabel: "Cloud backup",
    cloudBackupTitle: "Synced",
    cloudBackupDescription: "The manual backup procedure protects database data.",
    securityEyebrow: "Security",
    securityTitle: "Account protection",
    authenticationLabel: "Authentication",
    authenticationValue: "Protected",
    authenticationDescription: "Access protected through credentials.",
    sessionStatusLabel: "Session status",
    sessionStatusValue: "Active",
    sessionStatusDescription: "Active session on the current device.",
    onboardingEyebrow: "Onboarding",
    onboardingTitle: "Reopen tutorial",
    onboardingDescription: "Do you want to review the initial tutorial and the VOLTIS manifesto?",
    supportEyebrow: "Support",
    supportTitle: "Help center",
    documentationLabel: "Documentation",
    documentationTitle: "VOLTIS Docs",
    documentationDescription: "Planned area for documentation, procedures and internal guides.",
    communityLabel: "Community",
    communityTitle: "Private Traders Hub",
    communityDescription: "Private area planned for selected traders.",
    dangerEyebrow: "Danger zone",
    dangerTitle: "Critical actions",
    dangerDescription: "These actions are disabled until a safe procedure is ready.",
    resetLabel: "Reset preferences",
    resetTitle: "Restore default settings",
    resetDescription: "Action disabled to prevent accidental changes.",
    deleteLabel: "Delete account",
    deleteTitle: "Permanent removal",
    deleteDescription: "Action disabled to protect data and access.",
    statusEyebrow: "Status",
    statusTitle: "Settings Center ready",
    statusDescription: "The foundation is ready for full multilingual support, PWA, premium onboarding and final rebranding.",
  },
  uk: {
    platformEyebrow: "Налаштування платформи",
    title: "Налаштування",
    description: "Керуйте вподобаннями, внутрішніми сповіщеннями, безпекою, мовою, виглядом і конфігурацією застосунку.",
    languageEyebrow: "Мова",
    languageTitle: "Мова та локалізація",
    languageDescription: "Налаштуйте мову застосунку та валюту за замовчуванням.",
    appLanguageLabel: "Мова застосунку",
    appLanguageHint: "Багатомовна структура готова. Кожну нову сторінку буде завершено одразу всіма підтримуваними мовами.",
    defaultCurrencyLabel: "Валюта за замовчуванням",
    appearanceEyebrow: "Вигляд",
    appearanceTitle: "Тема та інтерфейс",
    themeLabel: "Тема",
    themeTitle: "Режим інтерфейсу",
    themeDescription: "Оберіть візуальний режим застосунку.",
    accentLabel: "Акцентний колір",
    accentTitle: "Візуальна ідентичність",
    accentDescription: "Основний колір платформи.",
    compactLabel: "Компактний режим",
    compactTitle: "Мінімальний макет",
    compactDescription: "Зменшує візуальну щільність інтерфейсу.",
    blurLabel: "Приховати показники",
    blurTitle: "Приховати баланси",
    blurDescription: "Приховує чутливі значення під час використання застосунку.",
    appExperienceEyebrow: "Досвід застосунку",
    appExperienceTitle: "Іконка та встановлення",
    iconVariantLabel: "Варіант іконки застосунку",
    iconVariantTitle: "Стиль домашнього екрана",
    iconVariantDescription: "Оберіть варіант іконки. PWA використає це налаштування на фінальному етапі.",
    pwaStatusLabel: "Статус PWA",
    pwaStatusValue: "Заплановано",
    pwaStatusDescription: "Встановлення як застосунку на desktop, mobile і tablet буде завершено в блоці PWA.",
    notificationsEyebrow: "Сповіщення",
    notificationsTitle: "Внутрішні сповіщення",
    inAppNotificationsLabel: "Сповіщення в застосунку",
    inAppNotificationsValue: "Увімкнено",
    inAppNotificationsDescription: "Усі важливі сповіщення надходять прямо у VOLTIS через Notification Center.",
    activeBadge: "Активно",
    reviewRemindersLabel: "Нагадування review",
    reviewRemindersDescription: "Сповіщення для обов’язкових операційних review.",
    sessionLockAlertsLabel: "Попередження блокування сесії",
    sessionLockAlertsDescription: "Сповіщення при підвищеному операційному ризику.",
    dailyReminderLabel: "Щоденне нагадування",
    dailyReminderDescription: "Щоденне нагадування заповнити торговий журнал.",
    enabled: "Увімкнено",
    disabled: "Вимкнено",
    saveSettings: "Зберегти налаштування",
    backupEyebrow: "Backup",
    backupTitle: "Керування даними",
    backupDescription: "Backup, export і захист даних. Ручний backup Supabase задокументований і доступний через локальний script.",
    exportTradesLabel: "Export угод",
    exportTradesTitle: "CSV Export",
    exportTradesDescription: "Запланована функція для експорту угод у форматі CSV.",
    cloudBackupLabel: "Cloud backup",
    cloudBackupTitle: "Синхронізовано",
    cloudBackupDescription: "Ручна процедура backup захищає дані database.",
    securityEyebrow: "Безпека",
    securityTitle: "Захист акаунту",
    authenticationLabel: "Автентифікація",
    authenticationValue: "Захищено",
    authenticationDescription: "Доступ захищено обліковими даними.",
    sessionStatusLabel: "Статус сесії",
    sessionStatusValue: "Активна",
    sessionStatusDescription: "Активна сесія на поточному пристрої.",
    onboardingEyebrow: "Onboarding",
    onboardingTitle: "Відкрити tutorial знову",
    onboardingDescription: "Хочете ще раз переглянути початковий tutorial і manifesto VOLTIS?",
    supportEyebrow: "Підтримка",
    supportTitle: "Центр допомоги",
    documentationLabel: "Документація",
    documentationTitle: "VOLTIS Docs",
    documentationDescription: "Запланована зона для документації, процедур і внутрішніх гайдів.",
    communityLabel: "Community",
    communityTitle: "Private Traders Hub",
    communityDescription: "Приватна зона, запланована для selected traders.",
    dangerEyebrow: "Danger zone",
    dangerTitle: "Критичні дії",
    dangerDescription: "Ці дії вимкнені, доки не буде готова безпечна процедура.",
    resetLabel: "Скинути вподобання",
    resetTitle: "Відновити стандартні налаштування",
    resetDescription: "Дію вимкнено, щоб уникнути випадкових змін.",
    deleteLabel: "Видалити акаунт",
    deleteTitle: "Постійне видалення",
    deleteDescription: "Дію вимкнено для захисту даних і доступів.",
    statusEyebrow: "Статус",
    statusTitle: "Settings Center готовий",
    statusDescription: "Основа готова для повного multilingua, PWA, premium onboarding і final rebranding.",
  },
  ru: {
    platformEyebrow: "Настройки платформы",
    title: "Настройки",
    description: "Управляйте предпочтениями, внутренними уведомлениями, безопасностью, языком, внешним видом и конфигурацией приложения.",
    languageEyebrow: "Язык",
    languageTitle: "Язык и локализация",
    languageDescription: "Настройте язык приложения и валюту по умолчанию.",
    appLanguageLabel: "Язык приложения",
    appLanguageHint: "Многоязычная структура готова. Каждая новая страница будет сразу завершаться на всех поддерживаемых языках.",
    defaultCurrencyLabel: "Валюта по умолчанию",
    appearanceEyebrow: "Внешний вид",
    appearanceTitle: "Тема и интерфейс",
    themeLabel: "Тема",
    themeTitle: "Режим интерфейса",
    themeDescription: "Выберите визуальный режим приложения.",
    accentLabel: "Акцентный цвет",
    accentTitle: "Визуальная идентичность",
    accentDescription: "Основной цвет платформы.",
    compactLabel: "Компактный режим",
    compactTitle: "Минимальный макет",
    compactDescription: "Уменьшает визуальную плотность интерфейса.",
    blurLabel: "Скрыть показатели",
    blurTitle: "Скрыть балансы",
    blurDescription: "Скрывает чувствительные значения во время использования приложения.",
    appExperienceEyebrow: "Опыт приложения",
    appExperienceTitle: "Иконка и установка",
    iconVariantLabel: "Вариант иконки приложения",
    iconVariantTitle: "Стиль домашнего экрана",
    iconVariantDescription: "Выберите вариант иконки. PWA использует эту настройку на финальном этапе.",
    pwaStatusLabel: "Статус PWA",
    pwaStatusValue: "Запланировано",
    pwaStatusDescription: "Установка как приложения на desktop, mobile и tablet будет завершена в блоке PWA.",
    notificationsEyebrow: "Уведомления",
    notificationsTitle: "Внутренние уведомления",
    inAppNotificationsLabel: "Уведомления в приложении",
    inAppNotificationsValue: "Включены",
    inAppNotificationsDescription: "Все важные уведомления приходят прямо в VOLTIS через Notification Center.",
    activeBadge: "Активно",
    reviewRemindersLabel: "Напоминания review",
    reviewRemindersDescription: "Уведомления для обязательных операционных review.",
    sessionLockAlertsLabel: "Предупреждения блокировки сессии",
    sessionLockAlertsDescription: "Уведомления при повышенном операционном риске.",
    dailyReminderLabel: "Ежедневное напоминание",
    dailyReminderDescription: "Ежедневное напоминание заполнить торговый журнал.",
    enabled: "Включено",
    disabled: "Выключено",
    saveSettings: "Сохранить настройки",
    backupEyebrow: "Backup",
    backupTitle: "Управление данными",
    backupDescription: "Backup, export и защита данных. Ручной backup Supabase задокументирован и доступен через локальный script.",
    exportTradesLabel: "Export сделок",
    exportTradesTitle: "CSV Export",
    exportTradesDescription: "Запланированная функция для экспорта сделок в формате CSV.",
    cloudBackupLabel: "Cloud backup",
    cloudBackupTitle: "Синхронизировано",
    cloudBackupDescription: "Ручная процедура backup защищает данные database.",
    securityEyebrow: "Безопасность",
    securityTitle: "Защита аккаунта",
    authenticationLabel: "Аутентификация",
    authenticationValue: "Защищено",
    authenticationDescription: "Доступ защищен учетными данными.",
    sessionStatusLabel: "Статус сессии",
    sessionStatusValue: "Активна",
    sessionStatusDescription: "Активная сессия на текущем устройстве.",
    onboardingEyebrow: "Onboarding",
    onboardingTitle: "Открыть tutorial снова",
    onboardingDescription: "Хотите снова посмотреть начальный tutorial и manifesto VOLTIS?",
    supportEyebrow: "Поддержка",
    supportTitle: "Центр помощи",
    documentationLabel: "Документация",
    documentationTitle: "VOLTIS Docs",
    documentationDescription: "Запланированная зона для документации, процедур и внутренних гайдов.",
    communityLabel: "Community",
    communityTitle: "Private Traders Hub",
    communityDescription: "Приватная зона, запланированная для selected traders.",
    dangerEyebrow: "Danger zone",
    dangerTitle: "Критические действия",
    dangerDescription: "Эти действия отключены, пока не будет готова безопасная процедура.",
    resetLabel: "Сбросить предпочтения",
    resetTitle: "Восстановить настройки по умолчанию",
    resetDescription: "Действие отключено, чтобы избежать случайных изменений.",
    deleteLabel: "Удалить аккаунт",
    deleteTitle: "Постоянное удаление",
    deleteDescription: "Действие отключено для защиты данных и доступов.",
    statusEyebrow: "Статус",
    statusTitle: "Settings Center готов",
    statusDescription: "Основа готова для полного multilingua, PWA, premium onboarding и final rebranding.",
  },
  es: {
    platformEyebrow: "Ajustes de plataforma",
    title: "Ajustes",
    description: "Gestiona preferencias, notificaciones internas, seguridad, idioma, apariencia y configuración de la app.",
    languageEyebrow: "Idioma",
    languageTitle: "Idioma y localización",
    languageDescription: "Configura el idioma de la app y la moneda predeterminada.",
    appLanguageLabel: "Idioma de la app",
    appLanguageHint: "La estructura multilingüe está lista. Cada nueva página se completará de inmediato en todos los idiomas soportados.",
    defaultCurrencyLabel: "Moneda predeterminada",
    appearanceEyebrow: "Apariencia",
    appearanceTitle: "Tema e interfaz",
    themeLabel: "Tema",
    themeTitle: "Modo de interfaz",
    themeDescription: "Elige el modo visual de la app.",
    accentLabel: "Color principal",
    accentTitle: "Identidad visual",
    accentDescription: "Color principal de la plataforma.",
    compactLabel: "Modo compacto",
    compactTitle: "Diseño minimalista",
    compactDescription: "Reduce la densidad visual de la interfaz.",
    blurLabel: "Ocultar rendimiento",
    blurTitle: "Ocultar balances",
    blurDescription: "Oculta valores sensibles durante el uso de la app.",
    appExperienceEyebrow: "Experiencia de app",
    appExperienceTitle: "Icono e instalación",
    iconVariantLabel: "Variante del icono",
    iconVariantTitle: "Estilo de pantalla de inicio",
    iconVariantDescription: "Elige la variante del icono. La PWA usará esta preferencia en la fase final.",
    pwaStatusLabel: "Estado PWA",
    pwaStatusValue: "Planificado",
    pwaStatusDescription: "La instalación como app en desktop, mobile y tablet se completará en el bloque PWA.",
    notificationsEyebrow: "Notificaciones",
    notificationsTitle: "Alertas in-app",
    inAppNotificationsLabel: "Notificaciones in-app",
    inAppNotificationsValue: "Activadas",
    inAppNotificationsDescription: "Todas las notificaciones importantes llegan directamente dentro de VOLTIS mediante Notification Center.",
    activeBadge: "Activo",
    reviewRemindersLabel: "Recordatorios review",
    reviewRemindersDescription: "Alertas para reviews operativas obligatorias.",
    sessionLockAlertsLabel: "Alertas de bloqueo de sesión",
    sessionLockAlertsDescription: "Notificaciones cuando el riesgo operativo es elevado.",
    dailyReminderLabel: "Recordatorio diario",
    dailyReminderDescription: "Recordatorio diario para completar el diario de trading.",
    enabled: "Activado",
    disabled: "Desactivado",
    saveSettings: "Guardar ajustes",
    backupEyebrow: "Backup",
    backupTitle: "Gestión de datos",
    backupDescription: "Backup, exportación y protección de datos. El backup manual de Supabase está documentado y disponible mediante script local.",
    exportTradesLabel: "Exportar trades",
    exportTradesTitle: "CSV Export",
    exportTradesDescription: "Función planificada para exportar trades en formato CSV.",
    cloudBackupLabel: "Cloud backup",
    cloudBackupTitle: "Sincronizado",
    cloudBackupDescription: "La procedure manual de backup protege los datos del database.",
    securityEyebrow: "Seguridad",
    securityTitle: "Protección de cuenta",
    authenticationLabel: "Autenticación",
    authenticationValue: "Protegido",
    authenticationDescription: "Acceso protegido mediante credenciales.",
    sessionStatusLabel: "Estado de sesión",
    sessionStatusValue: "Activa",
    sessionStatusDescription: "Sesión activa en el dispositivo actual.",
    onboardingEyebrow: "Onboarding",
    onboardingTitle: "Reabrir tutorial",
    onboardingDescription: "¿Quieres revisar el tutorial inicial y el manifesto VOLTIS?",
    supportEyebrow: "Soporte",
    supportTitle: "Centro de ayuda",
    documentationLabel: "Documentación",
    documentationTitle: "VOLTIS Docs",
    documentationDescription: "Área planificada para documentación, procedimientos y guías internas.",
    communityLabel: "Community",
    communityTitle: "Private Traders Hub",
    communityDescription: "Área privada planificada para selected traders.",
    dangerEyebrow: "Danger zone",
    dangerTitle: "Acciones críticas",
    dangerDescription: "Estas acciones están desactivadas hasta que exista un procedimiento seguro.",
    resetLabel: "Restablecer preferencias",
    resetTitle: "Restaurar ajustes predeterminados",
    resetDescription: "Acción desactivada para evitar cambios accidentales.",
    deleteLabel: "Eliminar cuenta",
    deleteTitle: "Eliminación permanente",
    deleteDescription: "Acción desactivada para proteger datos y accesos.",
    statusEyebrow: "Estado",
    statusTitle: "Settings Center listo",
    statusDescription: "La base está lista para soporte multilingüe completo, PWA, onboarding premium y rebranding final.",
  },
  fr: {
    platformEyebrow: "Paramètres de plateforme",
    title: "Paramètres",
    description: "Gérez les préférences, notifications internes, sécurité, langue, apparence et configuration de l’app.",
    languageEyebrow: "Langue",
    languageTitle: "Langue et localisation",
    languageDescription: "Configurez la langue de l’app et la devise par défaut.",
    appLanguageLabel: "Langue de l’app",
    appLanguageHint: "La structure multilingue est prête. Chaque nouvelle page sera terminée immédiatement dans toutes les langues prises en charge.",
    defaultCurrencyLabel: "Devise par défaut",
    appearanceEyebrow: "Apparence",
    appearanceTitle: "Thème et interface",
    themeLabel: "Thème",
    themeTitle: "Mode d’interface",
    themeDescription: "Choisissez le mode visuel de l’app.",
    accentLabel: "Couleur principale",
    accentTitle: "Identité visuelle",
    accentDescription: "Couleur principale de la plateforme.",
    compactLabel: "Mode compact",
    compactTitle: "Mise en page minimale",
    compactDescription: "Réduit la densité visuelle de l’interface.",
    blurLabel: "Masquer les performances",
    blurTitle: "Masquer les soldes",
    blurDescription: "Masque les valeurs sensibles pendant l’utilisation de l’app.",
    appExperienceEyebrow: "Expérience app",
    appExperienceTitle: "Icône et installation",
    iconVariantLabel: "Variante de l’icône",
    iconVariantTitle: "Style écran d’accueil",
    iconVariantDescription: "Choisissez la variante de l’icône. La PWA utilisera cette préférence lors de la phase finale.",
    pwaStatusLabel: "Statut PWA",
    pwaStatusValue: "Planifié",
    pwaStatusDescription: "L’installation comme app sur desktop, mobile et tablet sera complétée dans le bloc PWA.",
    notificationsEyebrow: "Notifications",
    notificationsTitle: "Alertes in-app",
    inAppNotificationsLabel: "Notifications in-app",
    inAppNotificationsValue: "Activées",
    inAppNotificationsDescription: "Toutes les notifications importantes arrivent directement dans VOLTIS via Notification Center.",
    activeBadge: "Actif",
    reviewRemindersLabel: "Rappels review",
    reviewRemindersDescription: "Alertes pour les reviews opérationnelles obligatoires.",
    sessionLockAlertsLabel: "Alertes de blocage session",
    sessionLockAlertsDescription: "Notifications lorsque le risque opérationnel est élevé.",
    dailyReminderLabel: "Rappel quotidien",
    dailyReminderDescription: "Rappel quotidien pour compléter le journal de trading.",
    enabled: "Activé",
    disabled: "Désactivé",
    saveSettings: "Enregistrer les paramètres",
    backupEyebrow: "Backup",
    backupTitle: "Gestion des données",
    backupDescription: "Backup, export et protection des données. Le backup manuel Supabase est documenté et disponible via un script local.",
    exportTradesLabel: "Exporter les trades",
    exportTradesTitle: "CSV Export",
    exportTradesDescription: "Fonction prévue pour exporter les trades au format CSV.",
    cloudBackupLabel: "Cloud backup",
    cloudBackupTitle: "Synchronisé",
    cloudBackupDescription: "La procédure manuelle de backup protège les données du database.",
    securityEyebrow: "Sécurité",
    securityTitle: "Protection du compte",
    authenticationLabel: "Authentification",
    authenticationValue: "Protégé",
    authenticationDescription: "Accès protégé par identifiants.",
    sessionStatusLabel: "Statut de session",
    sessionStatusValue: "Active",
    sessionStatusDescription: "Session active sur l’appareil actuel.",
    onboardingEyebrow: "Onboarding",
    onboardingTitle: "Rouvrir le tutorial",
    onboardingDescription: "Voulez-vous revoir le tutorial initial et le manifesto VOLTIS ?",
    supportEyebrow: "Support",
    supportTitle: "Centre d’aide",
    documentationLabel: "Documentation",
    documentationTitle: "VOLTIS Docs",
    documentationDescription: "Zone prévue pour la documentation, les procédures et les guides internes.",
    communityLabel: "Community",
    communityTitle: "Private Traders Hub",
    communityDescription: "Zone privée prévue pour selected traders.",
    dangerEyebrow: "Danger zone",
    dangerTitle: "Actions critiques",
    dangerDescription: "Ces actions sont désactivées jusqu’à ce qu’une procédure sûre soit prête.",
    resetLabel: "Réinitialiser les préférences",
    resetTitle: "Restaurer les paramètres par défaut",
    resetDescription: "Action désactivée pour éviter les changements accidentels.",
    deleteLabel: "Supprimer le compte",
    deleteTitle: "Suppression permanente",
    deleteDescription: "Action désactivée pour protéger les données et les accès.",
    statusEyebrow: "Statut",
    statusTitle: "Settings Center prêt",
    statusDescription: "La base est prête pour le multilingue complet, PWA, onboarding premium et rebranding final.",
  },
  de: {
    platformEyebrow: "Plattform-Einstellungen",
    title: "Einstellungen",
    description: "Verwalte Präferenzen, interne Benachrichtigungen, Sicherheit, Sprache, Erscheinungsbild und App-Konfiguration.",
    languageEyebrow: "Sprache",
    languageTitle: "Sprache & Lokalisierung",
    languageDescription: "Konfiguriere die App-Sprache und die Standardwährung.",
    appLanguageLabel: "App-Sprache",
    appLanguageHint: "Die Mehrsprachigkeitsstruktur ist bereit. Jede neue Seite wird sofort in allen unterstützten Sprachen abgeschlossen.",
    defaultCurrencyLabel: "Standardwährung",
    appearanceEyebrow: "Erscheinungsbild",
    appearanceTitle: "Theme & UI",
    themeLabel: "Theme",
    themeTitle: "Interface-Modus",
    themeDescription: "Wähle den visuellen Modus der App.",
    accentLabel: "Akzentfarbe",
    accentTitle: "Visuelle Identität",
    accentDescription: "Hauptfarbe der Plattform.",
    compactLabel: "Kompakter Modus",
    compactTitle: "Minimaler Aufbau",
    compactDescription: "Reduziert die visuelle Dichte der Oberfläche.",
    blurLabel: "Performance ausblenden",
    blurTitle: "Kontostände ausblenden",
    blurDescription: "Blendet sensible Werte während der Nutzung aus.",
    appExperienceEyebrow: "App-Erlebnis",
    appExperienceTitle: "Icon & Installation",
    iconVariantLabel: "App-Icon-Variante",
    iconVariantTitle: "Home-Screen-Stil",
    iconVariantDescription: "Wähle die Icon-Variante. Die PWA nutzt diese Präferenz in der finalen Phase.",
    pwaStatusLabel: "PWA-Status",
    pwaStatusValue: "Geplant",
    pwaStatusDescription: "Die Installation als App auf Desktop, Mobile und Tablet wird im PWA-Block abgeschlossen.",
    notificationsEyebrow: "Benachrichtigungen",
    notificationsTitle: "In-App-Hinweise",
    inAppNotificationsLabel: "In-App-Benachrichtigungen",
    inAppNotificationsValue: "Aktiviert",
    inAppNotificationsDescription: "Alle wichtigen Benachrichtigungen erscheinen direkt in VOLTIS über das Notification Center.",
    activeBadge: "Aktiv",
    reviewRemindersLabel: "Review-Erinnerungen",
    reviewRemindersDescription: "Hinweise für erforderliche operative Reviews.",
    sessionLockAlertsLabel: "Session-Lock-Hinweise",
    sessionLockAlertsDescription: "Benachrichtigungen bei erhöhtem operativem Risiko.",
    dailyReminderLabel: "Tägliche Erinnerung",
    dailyReminderDescription: "Tägliche Erinnerung zum Ausfüllen des Trading-Journals.",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    saveSettings: "Einstellungen speichern",
    backupEyebrow: "Backup",
    backupTitle: "Datenverwaltung",
    backupDescription: "Backup, Export und Datenschutz. Das manuelle Supabase-Backup ist dokumentiert und über ein lokales Script verfügbar.",
    exportTradesLabel: "Trades exportieren",
    exportTradesTitle: "CSV Export",
    exportTradesDescription: "Geplante Funktion zum Export von Trades im CSV-Format.",
    cloudBackupLabel: "Cloud backup",
    cloudBackupTitle: "Synchronisiert",
    cloudBackupDescription: "Die manuelle Backup-Prozedur schützt die Daten der database.",
    securityEyebrow: "Sicherheit",
    securityTitle: "Kontoschutz",
    authenticationLabel: "Authentifizierung",
    authenticationValue: "Geschützt",
    authenticationDescription: "Zugriff durch Zugangsdaten geschützt.",
    sessionStatusLabel: "Session-Status",
    sessionStatusValue: "Aktiv",
    sessionStatusDescription: "Aktive Session auf dem aktuellen Gerät.",
    onboardingEyebrow: "Onboarding",
    onboardingTitle: "Tutorial erneut öffnen",
    onboardingDescription: "Möchtest du das erste Tutorial und das VOLTIS-Manifest erneut ansehen?",
    supportEyebrow: "Support",
    supportTitle: "Hilfezentrum",
    documentationLabel: "Dokumentation",
    documentationTitle: "VOLTIS Docs",
    documentationDescription: "Geplanter Bereich für Dokumentation, Verfahren und interne Guides.",
    communityLabel: "Community",
    communityTitle: "Private Traders Hub",
    communityDescription: "Privater Bereich für selected traders geplant.",
    dangerEyebrow: "Danger zone",
    dangerTitle: "Kritische Aktionen",
    dangerDescription: "Diese Aktionen sind deaktiviert, bis ein sicheres Verfahren bereitsteht.",
    resetLabel: "Präferenzen zurücksetzen",
    resetTitle: "Standardeinstellungen wiederherstellen",
    resetDescription: "Aktion deaktiviert, um versehentliche Änderungen zu verhindern.",
    deleteLabel: "Konto löschen",
    deleteTitle: "Dauerhafte Entfernung",
    deleteDescription: "Aktion deaktiviert, um Daten und Zugriffe zu schützen.",
    statusEyebrow: "Status",
    statusTitle: "Settings Center bereit",
    statusDescription: "Die Grundlage ist bereit für vollständige Mehrsprachigkeit, PWA, Premium-Onboarding und finales Rebranding.",
  },
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    toast?: string;
    refresh?: string;
    reloaded?: string;
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
  });

  if (!user) {
    redirect("/login");
  }

  const language = normalizeAppLanguage(
    user.appLanguage
  );

  const t = settingsLabels[language];

  return (
    <div className="space-y-10">
      <SettingsHardRefresh />
      <GlobalToast status={query.toast} />

      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_35%)]" />

        <div className="relative z-10 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm text-green-400">
              {t.platformEyebrow}
            </p>

            <h1 className="mt-3 flex items-center gap-3 text-4xl font-black tracking-tight text-white sm:text-6xl">
              <Settings
                className="hidden text-green-400 sm:block"
                size={46}
              />
              {t.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
              {t.description}
            </p>
          </div>
        </div>
      </section>

      <form
        action={updateSettings}
        className="space-y-6"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Globe
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                {t.languageEyebrow}
              </p>

              <h2 className="text-2xl font-bold">
                {t.languageTitle}
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                {t.languageDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.appLanguageLabel}
              </p>

              <select
                name="appLanguage"
                defaultValue={language}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-gray-500">
                {t.appLanguageHint}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                {t.defaultCurrencyLabel}
              </p>

              <select
                name="defaultCurrency"
                defaultValue={
                  user.defaultCurrency ?? "USD"
                }
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="USD">
                  USD — US Dollar
                </option>
                <option value="EUR">
                  EUR — Euro
                </option>
                <option value="JPY">
                  JPY — Japanese Yen
                </option>
                <option value="GBP">
                  GBP — British Pound
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Palette
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                {t.appearanceEyebrow}
              </p>

              <h2 className="text-2xl font-bold">
                {t.appearanceTitle}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                {t.themeLabel}
              </p>

              <h3 className="mt-2 text-lg font-bold">
                {t.themeTitle}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t.themeDescription}
              </p>

              <select
                name="themePreference"
                defaultValue={
                  user.themePreference ?? "dark"
                }
                className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm outline-none focus:border-green-500/40"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </label>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                {t.accentLabel}
              </p>

              <h3 className="mt-2 text-lg font-bold">
                {t.accentTitle}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t.accentDescription}
              </p>

              <select
                name="accentColor"
                defaultValue={
                  user.accentColor ?? "green"
                }
                className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm outline-none focus:border-green-500/40"
              >
                <option value="green">
                  VOLTIS Green
                </option>
                <option value="blue">
                  Electric Blue
                </option>
                <option value="purple">
                  Premium Purple
                </option>
                <option value="amber">Amber</option>
                <option value="red">Red</option>
              </select>
            </label>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {t.compactLabel}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {t.compactTitle}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {t.compactDescription}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="compactMode"
                  defaultChecked={user.compactMode}
                  className="mt-1 h-5 w-5"
                />
              </div>
            </label>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {t.blurLabel}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {t.blurTitle}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {t.blurDescription}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="performanceBlur"
                  defaultChecked={
                    user.performanceBlur
                  }
                  className="mt-1 h-5 w-5"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Smartphone
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                {t.appExperienceEyebrow}
              </p>

              <h2 className="text-2xl font-bold">
                {t.appExperienceTitle}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                {t.iconVariantLabel}
              </p>

              <h3 className="mt-2 text-lg font-bold">
                {t.iconVariantTitle}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t.iconVariantDescription}
              </p>

              <select
                name="appIconVariant"
                defaultValue={
                  user.appIconVariant ?? "classic"
                }
                className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm outline-none focus:border-green-500/40"
              >
                <option value="classic">Classic</option>
                <option value="dark">Dark</option>
                <option value="premium">Premium</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>

            <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-5">
              <p className="text-sm text-gray-400">
                {t.pwaStatusLabel}
              </p>

              <h3 className="mt-2 text-lg font-bold text-green-400">
                {t.pwaStatusValue}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t.pwaStatusDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Bell
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                {t.notificationsEyebrow}
              </p>

              <h2 className="text-2xl font-bold">
                {t.notificationsTitle}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {t.inAppNotificationsLabel}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-green-400">
                    {t.inAppNotificationsValue}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {t.inAppNotificationsDescription}
                  </p>
                </div>

                <span className="rounded-xl bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-green-400">
                  {t.activeBadge}
                </span>
              </div>
            </div>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {t.reviewRemindersLabel}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {user.reviewReminders
                      ? t.enabled
                      : t.disabled}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {t.reviewRemindersDescription}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="reviewReminders"
                  defaultChecked={
                    user.reviewReminders
                  }
                  className="mt-1 h-5 w-5"
                />
              </div>
            </label>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {t.sessionLockAlertsLabel}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {user.sessionLockAlerts
                      ? t.enabled
                      : t.disabled}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {t.sessionLockAlertsDescription}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="sessionLockAlerts"
                  defaultChecked={
                    user.sessionLockAlerts
                  }
                  className="mt-1 h-5 w-5"
                />
              </div>
            </label>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {t.dailyReminderLabel}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {user.dailyTradingReminder
                      ? t.enabled
                      : t.disabled}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {t.dailyReminderDescription}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="dailyTradingReminder"
                  defaultChecked={
                    user.dailyTradingReminder
                  }
                  className="mt-1 h-5 w-5"
                />
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-green-500 px-6 py-4 font-bold text-black transition hover:bg-green-400"
        >
          {t.saveSettings}
        </button>
      </form>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center gap-3">
          <Download
            size={22}
            className="text-green-400"
          />

          <div>
            <p className="text-sm text-gray-400">
              {t.backupEyebrow}
            </p>

            <h2 className="text-2xl font-bold">
              {t.backupTitle}
            </h2>

            <p className="mt-2 max-w-3xl text-sm text-gray-500">
              {t.backupDescription}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]"
          >
            <p className="text-sm text-gray-400">
              {t.exportTradesLabel}
            </p>

            <h3 className="mt-2 text-lg font-bold">
              {t.exportTradesTitle}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.exportTradesDescription}
            </p>
          </button>

          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]"
          >
            <p className="text-sm text-gray-400">
              {t.cloudBackupLabel}
            </p>

            <h3 className="mt-2 text-lg font-bold">
              {t.cloudBackupTitle}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.cloudBackupDescription}
            </p>
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center gap-3">
          <ShieldAlert
            size={22}
            className="text-green-400"
          />

          <div>
            <p className="text-sm text-gray-400">
              {t.securityEyebrow}
            </p>

            <h2 className="text-2xl font-bold">
              {t.securityTitle}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.authenticationLabel}
            </p>

            <h3 className="mt-2 text-lg font-bold">
              {t.authenticationValue}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.authenticationDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.sessionStatusLabel}
            </p>

            <h3 className="mt-2 text-lg font-bold">
              {t.sessionStatusValue}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.sessionStatusDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen
            size={22}
            className="text-green-400"
          />

          <div>
            <p className="text-sm text-gray-400">
              {t.onboardingEyebrow}
            </p>

            <h2 className="text-2xl font-bold">
              {t.onboardingTitle}
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            {t.onboardingDescription}
          </p>

          <div className="mt-4">
            <ReopenOnboardingButton />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <LifeBuoy
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                {t.supportEyebrow}
              </p>

              <h2 className="text-2xl font-bold">
                {t.supportTitle}
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-gray-400">
                {t.documentationLabel}
              </p>

              <h3 className="mt-1 text-lg font-bold">
                {t.documentationTitle}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t.documentationDescription}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-gray-400">
                {t.communityLabel}
              </p>

              <h3 className="mt-1 text-lg font-bold">
                {t.communityTitle}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t.communityDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-red-500/10 bg-red-500/[0.03] p-6">
          <p className="text-sm text-red-300">
            {t.dangerEyebrow}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {t.dangerTitle}
          </h2>

          <p className="mt-2 text-sm text-red-200/70">
            {t.dangerDescription}
          </p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left opacity-60"
            >
              <p className="text-sm text-red-200">
                {t.resetLabel}
              </p>

              <h3 className="mt-1 text-lg font-bold text-white">
                {t.resetTitle}
              </h3>

              <p className="mt-2 text-sm text-red-200/70">
                {t.resetDescription}
              </p>
            </button>

            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left opacity-60"
            >
              <p className="text-sm text-red-200">
                {t.deleteLabel}
              </p>

              <h3 className="mt-1 text-lg font-bold text-white">
                {t.deleteTitle}
              </h3>

              <p className="mt-2 text-sm text-red-200/70">
                {t.deleteDescription}
              </p>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-gray-400">
          {t.statusEyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          {t.statusTitle}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {t.statusDescription}
        </p>
      </div>
    </div>
  );
}


