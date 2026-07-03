"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import OnboardingModal from "@/components/OnboardingModal";

type AppShellUser = {
  name: string | null;
  username: string;
  role: string;
  appLanguage?: string | null;
  appIconVariant?: string | null;
} | null;

export default function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AppShellUser;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-base text-white">
      <OnboardingModal appLanguage={user?.appLanguage} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        appLanguage={user?.appLanguage}
        iconVariant={user?.appIconVariant ?? "classic"}
      />

      <main className="relative min-h-screen flex-1 overflow-x-hidden">
        <Topbar user={user} onOpenSidebar={() => setSidebarOpen(true)} />

        <div className="p-4 pt-[calc(env(safe-area-inset-top)+5rem)] sm:p-6 sm:pt-[calc(env(safe-area-inset-top)+5.5rem)] lg:p-8 lg:pt-14">
          {children}

          <footer className="mt-16 hidden border-t border-white/5 pt-6 text-center print:hidden">
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
