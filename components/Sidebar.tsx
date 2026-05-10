"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/diary", label: "Trading Diary" },
  { href: "/calendar", label: "Calendar" },
  { href: "/equity", label: "Equity" },
  { href: "/rules", label: "Rules & Goals" },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10
          bg-[#071018] p-6 transition-transform duration-300
          lg:static lg:z-auto lg:w-64 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-400">
            Trading Diary
          </h1>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-10 flex flex-col gap-3 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  rounded-xl px-4 py-3 transition
                  ${
                    active
                      ? "bg-green-400/10 text-green-400"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}