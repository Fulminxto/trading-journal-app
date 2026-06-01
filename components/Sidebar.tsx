"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  LineChart,
  Target,
  Users,
  Shield,
  ArrowLeftRight,
  X,
  BarChart3,
  Zap,
  Bot,
  FileText,
  Megaphone,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

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
};

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

function isManager(
  permissions: AccountPermissions
) {
  return permissions.role === "MANAGER";
}

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
    path: "workspace",
    label: "Workspace Intelligence",
    icon: Users,
    canShow: (permissions) =>
      isManager(permissions) ||
      permissions.canViewAnalytics,
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

export default function Sidebar({
  open = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

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

  const adminLinks: SidebarLink[] = [
    {
      href: "/admin",
      label: "Admin Panel",
      icon: Shield,
    },
    {
      href: "/admin/accounts",
      label: "Accounts Management",
      icon: Users,
    },
    {
      href: "/admin/support",
      label: "Support Tickets",
      icon: FileText,
    },
    {
      href: "/admin/updates",
      label: "App Updates",
      icon: Megaphone,
    },
    {
      href: "/admin/maintenance",
      label: "Maintenance",
      icon: ShieldAlert,
    },
  ];

  const links = useMemo<SidebarLink[]>(() => {
    if (isAdminArea) {
      return adminLinks;
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
          label: link.label,
          icon: link.icon,
        })),
        {
          href: "/updates",
          label: "Updates",
          icon: Megaphone,
        },
        {
          href: "/accounts",
          label: "Switch Account",
          icon: ArrowLeftRight,
        },
      ];
    }

    return [
      {
        href: "/accounts",
        label: "Accounts",
        icon: Users,
      },
      {
        href: "/updates",
        label: "Updates",
        icon: Megaphone,
      },
    ];
  }, [
    accountId,
    accountPermissions,
    isAdminArea,
  ]);

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
        className={`fixed left-0 top-0 z-50 h-screen overflow-y-auto border-r border-white/10 bg-[#071018] p-4 transition-all duration-500 ease-out lg:sticky lg:z-40 ${isCollapsed
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
            onClick={onClose}
            className={`group flex items-center transition-all duration-500 ${isCollapsed
                ? "justify-center"
                : "gap-3"
              }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 group-hover:bg-white/[0.05]">
              <Zap
                size={17}
                strokeWidth={2.4}
                className="text-white"
              />
            </div>

            {!isCollapsed && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.42em] text-gray-600">
                  Performance System
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
              aria-label="Close sidebar"
              title="Close sidebar"
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="mt-10 flex flex-col gap-3 text-sm">
          {permissionsLoading &&
            accountId &&
            !isAdminArea &&
            !isCollapsed && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-gray-500">
                Loading permissions...
              </div>
            )}

          {links.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(
                `${link.href}/`
              );

            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group flex items-center rounded-xl transition ${isCollapsed
                    ? "justify-center px-3 py-3"
                    : "gap-3 px-4 py-3"
                  } ${active
                    ? "bg-green-400/10 text-green-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Icon size={18} />

                {!isCollapsed && (
                  <span>{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}