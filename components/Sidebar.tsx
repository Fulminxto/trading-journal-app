"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "lucide-react";

const baseLinks = [
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
  },

  {
    path: "rules",
    label: "Rules & Goals",
    icon: Target,
  },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  open = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const match = pathname.match(
    /^\/accounts\/([^/]+)/
  );

  const accountId = match?.[1];

  const links = accountId
    ? [
        ...baseLinks.map((link) => ({
          href: `/accounts/${accountId}/${link.path}`,
          label: link.label,
          icon: link.icon,
        })),

        {
          href: "/accounts",
          label: "Switch Account",
          icon: ArrowLeftRight,
        },

        ...(pathname.includes("/admin")
          ? [
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
            ]
          : []),
      ]
    : [
        {
          href: "/accounts",
          label: "Accounts",
          icon: Users,
        },

        ...(pathname.includes("/admin")
          ? [
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
            ]
          : []),
      ];

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-[#071018] p-6 transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Trading
            </p>

            <h1 className="mt-1 text-2xl font-bold text-green-400">
              Journal
            </h1>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-10 flex flex-col gap-3 text-sm">
          {links.map((link) => {
            const active =
              pathname === link.href;

            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-green-400/10 text-green-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />

                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}