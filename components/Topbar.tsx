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

import NotificationBell from "@/components/NotificationBell";
import { CRYSTAL_FACE } from "@/components/ui/Card";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type TopbarUser = {
  name: string | null;
  username: string;
  role: string;
  appLanguage?: string | null;
} | null;

type TopbarLabels = {
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

const labels: Record<AppLanguage, TopbarLabels> = {
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

export default function Topbar({
  user,
  onOpenSidebar,
}: {
  user: TopbarUser;
  onOpenSidebar: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const appLanguage = normalizeAppLanguage(user?.appLanguage);
  const t = labels[appLanguage] ?? labels.en;

  const displayName = user?.name || user?.username || t.profileFallback;
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-bg-base px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.25rem)] backdrop-blur-xl lg:inset-x-auto lg:right-8 lg:top-6 lg:border-none lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0 lg:pointer-events-none lg:backdrop-blur-none">
      <button
        onClick={onOpenSidebar}
        aria-label={t.openSidebar}
        title={t.openSidebar}
        className="relative overflow-hidden rounded-inner border-[0.5px] border-flash/[0.1] p-2 lg:hidden"
        style={{ background: CRYSTAL_FACE }}
      >
        <Menu size={20} className="relative z-10 text-muted" />
      </button>

      <div className="pointer-events-auto flex items-center gap-3">
        <NotificationBell language={appLanguage} />

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label={t.openProfileMenu}
            title={t.openProfileMenu}
            className="flex items-center sm:gap-2 sm:rounded-inner sm:border-[0.5px] sm:border-flash/[0.1] sm:px-3 sm:py-2 sm:shadow-2xl sm:backdrop-blur-xl sm:transition-all sm:duration-300"
          >
            <span
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-[0.5px] border-flash/[0.1] text-[12px] font-bold text-accent-bright"
              style={{ background: CRYSTAL_FACE }}
            >
              <span className="relative z-10">{initials}</span>
            </span>

            <div className="hidden text-left sm:block">
              <p className="text-[13px] font-semibold leading-tight text-white">
                {displayName}
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-muted-faint">
                {role}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-3 w-60 overflow-hidden rounded-card border-[0.5px] border-flash/[0.1] shadow-2xl"
              style={{ background: CRYSTAL_FACE }}
            >
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-flash/[0.1] text-sm font-bold text-accent-bright"
                    style={{ background: CRYSTAL_FACE }}
                  >
                    {initials}
                  </span>

                  <div>
                    <p className="text-sm font-bold text-white">
                      {displayName}
                    </p>

                    <p className="text-xs text-muted-faint">@{username}</p>
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
                  {t.profile}
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  <Settings size={17} />
                  {t.settings}
                </Link>

                <Link
                  href="/support"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  <LifeBuoy size={17} />
                  {t.support}
                </Link>

                <Link
                  href="/accounts"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeftRight size={17} />
                  {t.switchAccount}
                </Link>

                {(role === "FOUNDER" || role === "ADMIN") && (
                  <Link
                    href="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <Shield size={17} />
                    {t.admin}
                  </Link>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
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
  );
}
