"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  PanelLeftClose,
  PanelLeftOpen,
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
    path: "sessions",
    label: "Sessions",
    icon: BookOpen,
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

  const [collapsed, setCollapsed] =
    useState(false);

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
        className={`fixed left-0 top-0 z-50 h-screen overflow-y-auto border-r border-white/10 bg-[#071018] p-4 transition-all duration-300 lg:sticky lg:z-40 ${
          collapsed
            ? "w-[88px]"
            : "w-72 lg:w-64"
        } ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed
              ? "justify-center"
              : "justify-between"
          }`}
        >
          {!collapsed && (
            <Link
              href="/accounts"
              onClick={onClose}
              className="group"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 transition group-hover:text-gray-400">
                Trading
              </p>

              <h1 className="mt-1 text-2xl font-bold text-green-400 transition group-hover:text-green-300">
                Journal
              </h1>
            </Link>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCollapsed(
                  !collapsed
                )
              }
              className="hidden rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white lg:flex"
            >
              {collapsed ? (
                <PanelLeftOpen
                  size={18}
                />
              ) : (
                <PanelLeftClose
                  size={18}
                />
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
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
                className={`group flex items-center rounded-xl transition ${
                  collapsed
                    ? "justify-center px-3 py-3"
                    : "gap-3 px-4 py-3"
                } ${
                  active
                    ? "bg-green-400/10 text-green-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />

                {!collapsed && (
                  <span>
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}