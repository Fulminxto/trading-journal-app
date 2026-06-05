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
import NotificationBell from "@/components/NotificationBell";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type AppShellUser = {
  name: string | null;
  username: string;
  role: string;
  appLanguage?: string | null;
} | null;

type AppShellLabels = {
  profileFallback: string;
  userFallback: string;
  openProfileMenu: string;
  profile: string;
  settings: string;
  support: string;
  switchAccount: string;
  admin: string;
  logout: string;
  openSidebar: string;
};

const labels: Record<AppLanguage, AppShellLabels> = {
  it: {
    profileFallback: "Profilo",
    userFallback: "utente",
    openProfileMenu: "Apri menu profilo",
    profile: "Profilo",
    settings: "Impostazioni",
    support: "Supporto",
    switchAccount: "Cambia account",
    admin: "Admin",
    logout: "Esci",
    openSidebar: "Apri menu",
  },
  en: {
    profileFallback: "Profile",
    userFallback: "user",
    openProfileMenu: "Open profile menu",
    profile: "Profile",
    settings: "Settings",
    support: "Support",
    switchAccount: "Switch account",
    admin: "Admin",
    logout: "Logout",
    openSidebar: "Open sidebar",
  },
  uk: {
    profileFallback: "Профіль",
    userFallback: "користувач",
    openProfileMenu: "Відкрити меню профілю",
    profile: "Профіль",
    settings: "Налаштування",
    support: "Підтримка",
    switchAccount: "Змінити акаунт",
    admin: "Адмін",
    logout: "Вийти",
    openSidebar: "Відкрити меню",
  },
  ru: {
    profileFallback: "Профиль",
    userFallback: "пользователь",
    openProfileMenu: "Открыть меню профиля",
    profile: "Профиль",
    settings: "Настройки",
    support: "Поддержка",
    switchAccount: "Сменить аккаунт",
    admin: "Админ",
    logout: "Выйти",
    openSidebar: "Открыть меню",
  },
  es: {
    profileFallback: "Perfil",
    userFallback: "usuario",
    openProfileMenu: "Abrir menú de perfil",
    profile: "Perfil",
    settings: "Ajustes",
    support: "Soporte",
    switchAccount: "Cambiar cuenta",
    admin: "Admin",
    logout: "Cerrar sesión",
    openSidebar: "Abrir menú",
  },
  fr: {
    profileFallback: "Profil",
    userFallback: "utilisateur",
    openProfileMenu: "Ouvrir le menu du profil",
    profile: "Profil",
    settings: "Paramètres",
    support: "Support",
    switchAccount: "Changer de compte",
    admin: "Admin",
    logout: "Déconnexion",
    openSidebar: "Ouvrir le menu",
  },
  de: {
    profileFallback: "Profil",
    userFallback: "Benutzer",
    openProfileMenu: "Profilmenü öffnen",
    profile: "Profil",
    settings: "Einstellungen",
    support: "Support",
    switchAccount: "Konto wechseln",
    admin: "Admin",
    logout: "Abmelden",
    openSidebar: "Menü öffnen",
  },
};

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

  const appLanguage = normalizeAppLanguage(
    user?.appLanguage
  );

  const t = labels[appLanguage] ?? labels.en;

  const displayName =
    user?.name || user?.username || t.profileFallback;

  const username = user?.username || t.userFallback;
  const role = user?.role || "USER";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050b10] text-white">
      <OnboardingModal appLanguage={user?.appLanguage} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        appLanguage={user?.appLanguage}
      />

      <main className="relative min-h-screen flex-1 overflow-x-hidden">
        <div className="pointer-events-none fixed right-4 top-4 z-40 lg:right-8 lg:top-6">
          <div className="pointer-events-auto flex items-start gap-3">
            <NotificationBell language={appLanguage} />

            <div ref={profileRef} className="relative">
              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                aria-label={t.openProfileMenu}
                title={t.openProfileMenu}
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
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <User size={17} />
                      {t.profile}
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <Settings size={17} />
                      {t.settings}
                    </Link>

                    <Link
                      href="/support"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <LifeBuoy size={17} />
                      {t.support}
                    </Link>

                    <Link
                      href="/accounts"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <ArrowLeftRight size={17} />
                      {t.switchAccount}
                    </Link>

                    {(role === "FOUNDER" ||
                      role === "ADMIN") && (
                        <Link
                          href="/admin"
                          onClick={() =>
                            setProfileOpen(false)
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                        >
                          <Shield size={17} />
                          {t.admin}
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
                      {t.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-30 flex items-center px-4 pt-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label={t.openSidebar}
            title={t.openSidebar}
            className="rounded-2xl border border-white/10 bg-white/5 p-2"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 pt-16 sm:p-6 sm:pt-18 lg:p-8 lg:pt-14">
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
