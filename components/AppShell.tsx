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
    <div className="flex min-h-screen bg-[#050b10] text-white">
      <OnboardingModal />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="relative min-h-screen flex-1 overflow-x-hidden">
        <div className="pointer-events-none fixed right-4 top-4 z-40 lg:right-8 lg:top-6">
          <div
            ref={profileRef}
            className="pointer-events-auto relative"
          >
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#071018]/80 px-3 py-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-[#071018]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/10 text-[11px] font-bold text-green-400">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-[13px] font-semibold leading-tight text-white">
                  {displayName}
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-gray-500">
                  {role}
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#071018] shadow-2xl">
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

                  <Link
                    href="/support"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <LifeBuoy size={17} />
                    Support
                  </Link>

                  <Link
                    href="/accounts"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <ArrowLeftRight size={17} />
                    Switch Account
                  </Link>

                  {role === "MANAGER" && (
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

        <div className="sticky top-0 z-30 flex items-center px-4 pt-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-2xl border border-white/10 bg-white/5 p-2"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 pt-16 sm:p-6 sm:pt-18 lg:p-8 lg:pt-14">
          {children}

          <footer className="hidden print:hidden mt-16 border-t border-white/5 pt-6 text-center">
            <p className="text-xs tracking-wide text-gray-600">
              Built by Fulminato.
              <span className="ml-1">
                AI-assisted development.
              </span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
