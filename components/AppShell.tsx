"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Shield,
  ArrowLeftRight,
  LifeBuoy,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import OnboardingModal from "@/components/OnboardingModal";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);

  const displayName = user?.name || user?.username || "Profile";
  const username = user?.username || "user";
  const role = user?.role || "USER";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const supportHref =
    "mailto:yarikdziuban@gmail.com?subject=Support%20request%20-%20Trading%20Journal";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
  <div className="flex min-h-screen">
    <OnboardingModal />

    <Sidebar
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050b10]/90 px-4 py-3 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-400">
              Trading Journal
            </p>
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1 transition hover:bg-white/[0.06]"
            >
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-green-500/10 text-[11px] font-bold text-green-400">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-[11px] font-semibold text-white">
                  {displayName}
                </p>

                <p className="text-[10px] text-gray-500">
                  {role}
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#071018] shadow-2xl">
                <div className="border-b border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-sm font-bold text-green-400">
                      {initials}
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {displayName}
                      </p>

                      <p className="text-xs text-gray-500">
                        @{username}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <User size={17} />
                    Profilo
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <Settings size={17} />
                    Settings
                  </Link>

                  <a
                    href={supportHref}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <LifeBuoy size={17} />
                    Support
                  </a>

                  <Link
                    href="/accounts"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <ArrowLeftRight size={17} />
                    Switch Account
                  </Link>

                  {role === "OWNER" && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <Shield size={17} />
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={() =>
                      signOut({
                        callbackUrl: "/login",
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}