"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import VoltisLightningLoader from "@/components/VoltisLightningLoader";
import SignatureEdge from "@/components/ui/SignatureEdge";

import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  LineChart,
  Target,
  Users,
  Activity,
  Archive,
  Shield,
  ArrowLeftRight,
  X,
  BarChart3,
  Bot,
  ClipboardCheck,
  FileText,
  Megaphone,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import {
  getIconVariant,
  type IconVariantId,
} from "@/lib/icon-variants";

import { isManager } from "@/lib/permissions";

type AccountPermissions = {
  role: string;

  canCreateTrades: boolean;
  canEditTrades: boolean;
  canDeleteTrades: boolean;

  canViewAnalytics: boolean;
  canViewReports: boolean;
  canViewCopilot: boolean;
  canViewMembers: boolean;

  canManageMembers: boolean;
  canManageRoles: boolean;
  canManageAccount: boolean;
};

type AccountLink = {
  path: string;
  label: string;
  icon: LucideIcon;
  canShow?: (
    permissions: AccountPermissions
  ) => boolean;
};

type SidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: "workspace" | "general";
};

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
  appLanguage?: string | null;
  iconVariant?: string | null;
};

type SidebarLabels = {
  performanceSystem: string;
  closeSidebar: string;
  loadingPermissions: string;

  dashboard: string;
  diary: string;
  calendar: string;
  equity: string;
  analytics: string;
  reports: string;
  copilot: string;
  playbook: string;
  workspace: string;
  sessions: string;
  rules: string;
  integrations: string;

  updates: string;
  switchAccount: string;
  accounts: string;
  activity: string;
  archive: string;

  workspaceGroup: string;
  generalGroup: string;
  systemGroup: string;

  adminPanel: string;
  accountsManagement: string;
  supportTickets: string;
  appUpdates: string;
  maintenance: string;
};

const sidebarLabels: Record<
  AppLanguage,
  SidebarLabels
> = {
  it: {
    performanceSystem: "Sistema Performance",
    closeSidebar: "Chiudi menu",
    loadingPermissions: "Caricamento permessi...",

    dashboard: "Dashboard",
    diary: "Trading Diary",
    calendar: "Calendario",
    equity: "Equity",
    analytics: "Analytics",
    reports: "Reports",
    copilot: "Copilot",
    playbook: "Playbook",
    workspace: "Workspace Intelligence",
    sessions: "Sessions",
    rules: "Rules & Goals",
    integrations: "Integrazioni",

    updates: "Aggiornamenti",
    switchAccount: "Cambia account",
    accounts: "Account",
    activity: "Attivita",
    archive: "Archivio",

    workspaceGroup: "WORKSPACE",
    generalGroup: "GENERALE",
    systemGroup: "SYSTEM",

    adminPanel: "Pannello Admin",
    accountsManagement: "Gestione Account",
    supportTickets: "Ticket Supporto",
    appUpdates: "Aggiornamenti App",
    maintenance: "Manutenzione",
  },

  en: {
    performanceSystem: "Performance System",
    closeSidebar: "Close sidebar",
    loadingPermissions: "Loading permissions...",

    dashboard: "Dashboard",
    diary: "Trading Diary",
    calendar: "Calendar",
    equity: "Equity",
    analytics: "Analytics",
    reports: "Reports",
    copilot: "Copilot",
    playbook: "Playbook",
    workspace: "Workspace Intelligence",
    sessions: "Sessions",
    rules: "Rules & Goals",
    integrations: "Integrations",

    updates: "Updates",
    switchAccount: "Switch Account",
    accounts: "Accounts",
    activity: "Activity",
    archive: "Archive",

    workspaceGroup: "WORKSPACE",
    generalGroup: "GENERAL",
    systemGroup: "SYSTEM",

    adminPanel: "Admin Panel",
    accountsManagement: "Accounts Management",
    supportTickets: "Support Tickets",
    appUpdates: "App Updates",
    maintenance: "Maintenance",
  },

  uk: {
    performanceSystem: "Система продуктивності",
    closeSidebar: "Закрити меню",
    loadingPermissions: "Завантаження дозволів...",

    dashboard: "Панель",
    diary: "Торговий щоденник",
    calendar: "Календар",
    equity: "Equity",
    analytics: "Аналітика",
    reports: "Звіти",
    copilot: "Copilot",
    playbook: "Playbook",
    workspace: "Workspace Intelligence",
    sessions: "Сесії",
    rules: "Правила та цілі",
    integrations: "Інтеграції",

    updates: "Оновлення",
    switchAccount: "Змінити акаунт",
    accounts: "Акаунти",
    activity: "Activity",
    archive: "Archive",

    workspaceGroup: "WORKSPACE",
    generalGroup: "ЗАГАЛЬНЕ",
    systemGroup: "SYSTEM",

    adminPanel: "Адмін-панель",
    accountsManagement: "Керування акаунтами",
    supportTickets: "Тікети підтримки",
    appUpdates: "Оновлення застосунку",
    maintenance: "Обслуговування",
  },

  ru: {
    performanceSystem: "Система производительности",
    closeSidebar: "Закрыть меню",
    loadingPermissions: "Загрузка разрешений...",

    dashboard: "Панель",
    diary: "Торговый дневник",
    calendar: "Календарь",
    equity: "Equity",
    analytics: "Аналитика",
    reports: "Отчеты",
    copilot: "Copilot",
    playbook: "Playbook",
    workspace: "Workspace Intelligence",
    sessions: "Сессии",
    rules: "Правила и цели",
    integrations: "Интеграции",

    updates: "Обновления",
    switchAccount: "Сменить аккаунт",
    accounts: "Аккаунты",
    activity: "Activity",
    archive: "Archive",

    workspaceGroup: "WORKSPACE",
    generalGroup: "ОБЩЕЕ",
    systemGroup: "SYSTEM",

    adminPanel: "Админ-панель",
    accountsManagement: "Управление аккаунтами",
    supportTickets: "Тикеты поддержки",
    appUpdates: "Обновления приложения",
    maintenance: "Обслуживание",
  },

  es: {
    performanceSystem: "Sistema de rendimiento",
    closeSidebar: "Cerrar menú",
    loadingPermissions: "Cargando permisos...",

    dashboard: "Panel",
    diary: "Diario de trading",
    calendar: "Calendario",
    equity: "Equity",
    analytics: "Analítica",
    reports: "Informes",
    copilot: "Copilot",
    playbook: "Playbook",
    workspace: "Workspace Intelligence",
    sessions: "Sesiones",
    rules: "Reglas y objetivos",
    integrations: "Integraciones",

    updates: "Actualizaciones",
    switchAccount: "Cambiar cuenta",
    accounts: "Cuentas",
    activity: "Actividad",
    archive: "Archivo",

    workspaceGroup: "WORKSPACE",
    generalGroup: "GENERAL",
    systemGroup: "SYSTEM",

    adminPanel: "Panel Admin",
    accountsManagement: "Gestión de cuentas",
    supportTickets: "Tickets de soporte",
    appUpdates: "Actualizaciones de la app",
    maintenance: "Mantenimiento",
  },

  fr: {
    performanceSystem: "Système de performance",
    closeSidebar: "Fermer le menu",
    loadingPermissions: "Chargement des autorisations...",

    dashboard: "Tableau de bord",
    diary: "Journal de trading",
    calendar: "Calendrier",
    equity: "Equity",
    analytics: "Analytics",
    reports: "Rapports",
    copilot: "Copilot",
    playbook: "Playbook",
    workspace: "Workspace Intelligence",
    sessions: "Sessions",
    rules: "Règles et objectifs",
    integrations: "Intégrations",

    updates: "Mises à jour",
    switchAccount: "Changer de compte",
    accounts: "Comptes",
    activity: "Activite",
    archive: "Archive",

    workspaceGroup: "WORKSPACE",
    generalGroup: "GÉNÉRAL",
    systemGroup: "SYSTEM",

    adminPanel: "Panneau Admin",
    accountsManagement: "Gestion des comptes",
    supportTickets: "Tickets support",
    appUpdates: "Mises à jour de l’app",
    maintenance: "Maintenance",
  },

  de: {
    performanceSystem: "Performance-System",
    closeSidebar: "Menü schließen",
    loadingPermissions: "Berechtigungen werden geladen...",

    dashboard: "Dashboard",
    diary: "Trading-Tagebuch",
    calendar: "Kalender",
    equity: "Equity",
    analytics: "Analytics",
    reports: "Berichte",
    copilot: "Copilot",
    playbook: "Playbook",
    workspace: "Workspace Intelligence",
    sessions: "Sessions",
    rules: "Regeln & Ziele",
    integrations: "Integrationen",

    updates: "Updates",
    switchAccount: "Konto wechseln",
    accounts: "Konten",
    activity: "Aktivitat",
    archive: "Archiv",

    workspaceGroup: "WORKSPACE",
    generalGroup: "ALLGEMEIN",
    systemGroup: "SYSTEM",

    adminPanel: "Admin-Bereich",
    accountsManagement: "Kontoverwaltung",
    supportTickets: "Support-Tickets",
    appUpdates: "App-Updates",
    maintenance: "Wartung",
  },
};

const baseLinks: AccountLink[] = [
  {
    path: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "diary",
    label: "Trading Diary",
    icon: BookOpen,
  },
  {
    path: "calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    path: "equity",
    label: "Equity",
    icon: LineChart,
  },
  {
    path: "analytics",
    label: "Analytics",
    icon: BarChart3,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canViewAnalytics,
  },
  {
    path: "reports",
    label: "Reports",
    icon: FileText,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canViewReports,
  },
  {
    path: "copilot",
    label: "Copilot",
    icon: Bot,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canViewCopilot,
  },
  {
    path: "playbook",
    label: "Playbook",
    icon: ClipboardCheck,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canCreateTrades,
  },
  {
    path: "workspace",
    label: "Workspace Intelligence",
    icon: Users,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canViewMembers,
  },
  {
    path: "sessions",
    label: "Sessions",
    icon: BookOpen,
  },
  {
    path: "rules",
    label: "Rules & Goals",
    icon: Target,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canManageAccount,
  },
  {
    path: "integrations",
    label: "Integrations",
    icon: ArrowLeftRight,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canManageAccount,
  },
];

function getAccountLinkLabel(
  path: string,
  fallback: string,
  labels: SidebarLabels
) {
  if (path === "dashboard") {
    return labels.dashboard;
  }

  if (path === "diary") {
    return labels.diary;
  }

  if (path === "calendar") {
    return labels.calendar;
  }

  if (path === "equity") {
    return labels.equity;
  }

  if (path === "analytics") {
    return labels.analytics;
  }

  if (path === "reports") {
    return labels.reports;
  }

  if (path === "copilot") {
    return labels.copilot;
  }

  if (path === "playbook") {
    return labels.playbook;
  }

  if (path === "workspace") {
    return labels.workspace;
  }

  if (path === "sessions") {
    return labels.sessions;
  }

  if (path === "rules") {
    return labels.rules;
  }

  if (path === "integrations") {
    return labels.integrations;
  }

  return fallback;
}

export default function Sidebar({
  open = false,
  onClose,
  appLanguage,
  iconVariant,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const language =
    normalizeAppLanguage(appLanguage);

  const t =
    sidebarLabels[language] ?? sidebarLabels.en;

  const logoSrc = getIconVariant(
    (iconVariant as IconVariantId | null | undefined) ?? "classic"
  ).svg;

  const [collapsed, setCollapsed] =
    useState(true);

  const [
    accountPermissions,
    setAccountPermissions,
  ] = useState<AccountPermissions | null>(
    null
  );

  const [permissionsLoading, setPermissionsLoading] =
    useState(false);

  const isCollapsed = open
    ? false
    : collapsed;

  const match = pathname.match(
    /^\/accounts\/([^/]+)/
  );

  const rawAccountId = match?.[1];

  const accountId =
    rawAccountId &&
      rawAccountId !== "create" &&
      rawAccountId !== "manage"
      ? rawAccountId
      : undefined;

  const isAdminArea =
    pathname.startsWith("/admin");

  useEffect(() => {
    let cancelled = false;

    async function loadPermissions() {
      if (!accountId || isAdminArea) {
        setAccountPermissions(null);
        return;
      }

      setPermissionsLoading(true);

      try {
        const response = await fetch(
          `/api/accounts/${accountId}/permissions`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load account permissions"
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setAccountPermissions(
            data.membership
          );
        }
      } catch {
        if (!cancelled) {
          setAccountPermissions(null);
        }
      } finally {
        if (!cancelled) {
          setPermissionsLoading(false);
        }
      }
    }

    loadPermissions();

    return () => {
      cancelled = true;
    };
  }, [accountId, isAdminArea]);

  const links = useMemo<SidebarLink[]>(() => {
    if (isAdminArea) {
      return [
        {
          href: "/admin",
          label: t.adminPanel,
          icon: Shield,
        },
        {
          href: "/admin/accounts",
          label: t.accountsManagement,
          icon: Users,
        },
        {
          href: "/admin/support",
          label: t.supportTickets,
          icon: FileText,
        },
        {
          href: "/admin/updates",
          label: t.appUpdates,
          icon: Megaphone,
        },
        {
          href: "/admin/maintenance",
          label: t.maintenance,
          icon: ShieldAlert,
        },
      ];
    }

    if (accountId) {
      const visibleAccountLinks =
        accountPermissions
          ? baseLinks.filter((link) => {
            if (!link.canShow) {
              return true;
            }

            return link.canShow(
              accountPermissions
            );
          })
          : baseLinks.filter(
            (link) => !link.canShow
          );

      return [
        ...visibleAccountLinks.map((link) => ({
          href: `/accounts/${accountId}/${link.path}`,
          label: getAccountLinkLabel(
            link.path,
            link.label,
            t
          ),
          icon: link.icon,
          group: "workspace" as const,
        })),
      ];
    }

    return [
      {
        href: "/accounts",
        label: t.accounts,
        icon: Users,
        group: "workspace" as const,
      },
      {
        href: "/activities",
        label: t.activity,
        icon: Activity,
        group: "workspace" as const,
      },
      {
        href: "/accounts/manage",
        label: t.archive,
        icon: Archive,
        group: "workspace" as const,
      },
      {
        href: "/updates",
        label: t.updates,
        icon: Megaphone,
        group: "general" as const,
      },
    ];
  }, [
    accountId,
    accountPermissions,
    isAdminArea,
    t,
  ]);

  const groupedLinks = useMemo(() => {
    const hasGroups = links.some((link) => link.group);

    if (!hasGroups) {
      return [{ id: "flat", label: undefined, items: links }];
    }

    return [
      {
        id: "workspace",
        label: t.workspaceGroup,
        items: links.filter(
          (link) => link.group !== "general"
        ),
      },
      {
        id: "general",
        label: t.systemGroup,
        items: links.filter(
          (link) => link.group === "general"
        ),
      },
    ].filter((group) => group.items.length > 0);
  }, [links, t]);

  const activeHref = useMemo(() => {
    const active = links.find(
      (link) =>
        pathname === link.href ||
        (link.href !== "/accounts" &&
          pathname.startsWith(`${link.href}/`))
    );

    return active?.href;
  }, [links, pathname]);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef(
    new Map<string, HTMLAnchorElement>()
  );

  const [edgeRect, setEdgeRect] = useState<{
    top: number;
    height: number;
  } | null>(null);

  const updateEdgeRect = useCallback(() => {
    const navEl = navRef.current;
    const activeEl = activeHref
      ? linkRefs.current.get(activeHref)
      : null;

    if (navEl && activeEl) {
      const navTop = navEl.getBoundingClientRect().top;
      const linkRect = activeEl.getBoundingClientRect();

      setEdgeRect({
        top: linkRect.top - navTop,
        height: linkRect.height,
      });
    } else {
      setEdgeRect(null);
    }
  }, [activeHref]);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(updateEdgeRect);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [
    updateEdgeRect,
    isCollapsed,
    groupedLinks,
    isPending,
    pendingHref,
  ]);

  useEffect(() => {
    window.addEventListener("resize", updateEdgeRect);

    return () => {
      window.removeEventListener("resize", updateEdgeRect);
    };
  }, [updateEdgeRect]);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        onMouseEnter={() =>
          setCollapsed(false)
        }
        onMouseLeave={() =>
          setCollapsed(true)
        }
        className={`faded-scroll sidebar-scrollbar-none fixed left-0 top-0 z-50 flex h-screen flex-col overflow-y-auto border-r border-flash/[0.12] bg-surface-1 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] shadow-[24px_0_56px_rgba(6,10,26,0.28)] transition-all duration-500 ease-out after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-8 after:bg-gradient-to-l after:from-bg-base/55 after:via-bg-base/20 after:to-transparent after:backdrop-blur-[2px] after:content-[''] lg:sticky lg:z-40 lg:pt-4 ${isCollapsed
          ? "w-[88px]"
          : "w-72 lg:w-64"
          } ${open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div
          className={`flex items-center ${isCollapsed
            ? "justify-center"
            : "justify-between"
            }`}
        >
          <Link
            href="/accounts"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onClose?.();
              setPendingHref("/accounts");
              startTransition(() => router.push("/accounts"));
            }}
            className={`group flex items-center transition-all duration-500 ${isCollapsed
              ? "justify-center"
              : "gap-3"
              }`}
          >
            <img
              src={logoSrc}
              alt="VOLTIS"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 object-contain"
            />

            {!isCollapsed && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.42em] text-muted-faint">
                  {t.performanceSystem}
                </p>

                <h1 className="mt-[2px] text-[24px] font-semibold leading-none tracking-tight text-white">
                  VOLTIS
                </h1>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={onClose}
              aria-label={t.closeSidebar}
              title={t.closeSidebar}
              className="rounded-lg p-2 text-muted hover:bg-white/10 lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="mt-4 border-t border-white/[0.06]" />

        <nav
          ref={navRef}
          className="relative mt-6 flex flex-1 flex-col gap-4 text-sm"
        >
          {edgeRect && (
            <SignatureEdge
              orientation="vertical"
              pulse
              className="absolute left-0 z-10 transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                top: 0,
                height: edgeRect.height,
                transform: `translateY(${edgeRect.top}px)`,
              }}
            />
          )}

          {permissionsLoading &&
            accountId &&
            !isAdminArea &&
            !isCollapsed && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-faint">
                {t.loadingPermissions}
              </div>
            )}

          {groupedLinks.map((group, groupIndex) => (
            <div key={group.id}>
              {group.label && !isCollapsed && (
                <p className="mb-2 px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-faint">
                  {group.label}
                </p>
              )}

              <div className="flex flex-col gap-1">
                {group.items.map((link) => {
                  const active = link.href === activeHref;

                  const Icon = link.icon;
                  const isThisPending =
                    isPending && pendingHref === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      ref={(el) => {
                        if (el) {
                          linkRefs.current.set(link.href, el);
                        } else {
                          linkRefs.current.delete(link.href);
                        }
                      }}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                        e.preventDefault();
                        onClose?.();
                        setPendingHref(link.href);
                        startTransition(() => router.push(link.href));
                      }}
                      className={`group flex items-center rounded-xl transition-colors duration-base ${isCollapsed
                        ? "justify-center px-3 py-3"
                        : "gap-3 px-4 py-3"
                        } ${active
                          ? "bg-gradient-to-r from-accent/15 via-accent/[0.04] to-transparent text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      {isThisPending ? (
                        <VoltisLightningLoader size={18} />
                      ) : (
                        <Icon
                          size={18}
                          className={
                            active
                              ? "text-accent-bright"
                              : "text-muted transition-colors duration-base group-hover:text-accent-bright"
                          }
                        />
                      )}

                      {!isCollapsed && (
                        <span>{link.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {groupIndex < groupedLinks.length - 1 && (
                <div className="mt-4 border-t border-white/[0.06]" />
              )}
            </div>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="mt-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="border-t border-white/[0.06]" />
            <div className="pt-3 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/[0.22]">
                TRADING OS
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-faint/60">
                VOLTIS v0.1.0
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
