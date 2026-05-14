"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Shield,
  ArrowLeftRight,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

type AppShellUser = {
  name: string | null;
  username: string;
  role: string;
} | null;

export default function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AppShellUser;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const displayName =
    user?.name || user?.username || "User";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050b10]/90 px-4 py-4 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-400">
              Trading Journal
            </p>
          </div>

          {user && (
            <div className="relative">
              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:bg-white/[0.06]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-sm font-bold text-green-400">
                  {initials}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-white">
                    {displayName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.role}
                  </p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-white/10 bg-[#071018] shadow-2xl">
                  <div className="border-b border-white/10 p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-lg font-bold text-green-400">
                        {initials}
                      </div>

                      <div>
                        <p className="font-bold">
                          {displayName}
                        </p>

                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <User size={18} />
                      Profilo
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <Settings size={18} />
                      Settings
                    </Link>

                    <Link
                      href="/accounts"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <ArrowLeftRight size={18} />
                      Switch Account
                    </Link>

                    {user.role === "OWNER" && (
                      <Link
                        href="/admin"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        <Shield size={18} />
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={() =>
                        signOut({
                          callbackUrl: "/login",
                        })
                      }
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}