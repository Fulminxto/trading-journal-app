import {
  Settings,
  Palette,
  Bell,
  Download,
  ShieldAlert,
  LifeBuoy,
  BookOpen,
  Globe,
  Smartphone,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import ReopenOnboardingButton from "@/components/ReopenOnboardingButton";
import GlobalToast from "@/components/GlobalToast";

import { updateSettings } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    toast?: string;
  }>;
}) {
  const query = await searchParams;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <GlobalToast status={query.toast} />

      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Impostazioni piattaforma
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <Settings className="text-green-400" />
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Gestisci preferenze, notifiche interne, sicurezza, lingua, aspetto e configurazione dell’app.
        </p>
      </div>

      <div className="space-y-6">
        <form
          action={updateSettings}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Globe
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Language
                </p>

                <h2 className="text-2xl font-bold">
                  Lingua & Localizzazione
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-gray-400">
                  App Language
                </p>

                <select
                  name="appLanguage"
                  defaultValue={user.appLanguage}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                >
                  <option value="it">
                    Italiano
                  </option>

                  <option value="en">
                    English
                  </option>

                  <option value="uk">
                    Українська
                  </option>

                  <option value="es">
                    Español
                  </option>

                  <option value="fr">
                    Français
                  </option>

                  <option value="de">
                    Deutsch
                  </option>
                </select>

                <p className="mt-2 text-xs text-gray-500">
                  La traduzione completa verrà collegata nella fase finale del Settings Center.
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm text-gray-400">
                  Default Currency
                </p>

                <select
                  name="defaultCurrency"
                  defaultValue={user.defaultCurrency}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                >
                  <option value="USD">
                    USD — US Dollar
                  </option>

                  <option value="EUR">
                    EUR — Euro
                  </option>

                  <option value="JPY">
                    JPY — Japanese Yen
                  </option>

                  <option value="GBP">
                    GBP — British Pound
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Palette
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Appearance
                </p>

                <h2 className="text-2xl font-bold">
                  Tema & UI
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  Theme
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  Interface mode
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Scegli la modalità visiva dell’app.
                </p>

                <select
                  name="themePreference"
                  defaultValue={user.themePreference}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm outline-none focus:border-green-500/40"
                >
                  <option value="dark">
                    Dark
                  </option>

                  <option value="light">
                    Light
                  </option>

                  <option value="system">
                    System
                  </option>
                </select>
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  Accent Color
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  Visual identity
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Colore principale della piattaforma.
                </p>

                <select
                  name="accentColor"
                  defaultValue={user.accentColor}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm outline-none focus:border-green-500/40"
                >
                  <option value="green">
                    VOLTIS Green
                  </option>

                  <option value="blue">
                    Electric Blue
                  </option>

                  <option value="purple">
                    Premium Purple
                  </option>

                  <option value="amber">
                    Amber
                  </option>

                  <option value="red">
                    Red
                  </option>
                </select>
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Compact Mode
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      Minimal layout
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Riduce la densità visiva dell’interfaccia.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="compactMode"
                    defaultChecked={user.compactMode}
                    className="mt-1 h-5 w-5"
                  />
                </div>
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Performance Blur
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      Hide balances
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Nasconde valori sensibili durante l’utilizzo.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="performanceBlur"
                    defaultChecked={user.performanceBlur}
                    className="mt-1 h-5 w-5"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Smartphone
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  App Experience
                </p>

                <h2 className="text-2xl font-bold">
                  Icona & Installazione
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  App Icon Variant
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  Home screen style
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Scegli la variante dell’icona dell’app. La PWA userà questa preferenza nella fase finale.
                </p>

                <select
                  name="appIconVariant"
                  defaultValue={user.appIconVariant}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm outline-none focus:border-green-500/40"
                >
                  <option value="classic">
                    Classic
                  </option>

                  <option value="dark">
                    Dark
                  </option>

                  <option value="premium">
                    Premium
                  </option>

                  <option value="minimal">
                    Minimal
                  </option>
                </select>
              </label>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-5">
                <p className="text-sm text-gray-400">
                  PWA Status
                </p>

                <h3 className="mt-2 text-lg font-bold text-green-400">
                  Planned
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Installazione come app su desktop, mobile e tablet verrà completata nel blocco PWA.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Bell
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Notifications
                </p>

                <h2 className="text-2xl font-bold">
                  In-app Alerts
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      In-app Notifications
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-green-400">
                      Enabled
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Tutte le notifiche importanti arrivano direttamente dentro VOLTIS tramite il Notification Center.
                    </p>
                  </div>

                  <span className="rounded-xl bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-green-400">
                    Active
                  </span>
                </div>
              </div>

              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Review Reminders
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      {user.reviewReminders
                        ? "Enabled"
                        : "Disabled"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Alert per review operative obbligatorie.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="reviewReminders"
                    defaultChecked={user.reviewReminders}
                    className="mt-1 h-5 w-5"
                  />
                </div>
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Session Lock Alerts
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      {user.sessionLockAlerts
                        ? "Enabled"
                        : "Disabled"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Notifiche rischio operativo elevato.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="sessionLockAlerts"
                    defaultChecked={user.sessionLockAlerts}
                    className="mt-1 h-5 w-5"
                  />
                </div>
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Daily Reminder
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      {user.dailyTradingReminder
                        ? "Enabled"
                        : "Disabled"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Reminder giornaliero compilazione trade.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="dailyTradingReminder"
                    defaultChecked={user.dailyTradingReminder}
                    className="mt-1 h-5 w-5"
                  />
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-green-500 px-6 py-4 font-bold text-black transition hover:bg-green-400"
          >
            Salva impostazioni
          </button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Download
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                Backup
              </p>

              <h2 className="text-2xl font-bold">
                Data Management
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]"
            >
              <p className="text-sm text-gray-400">
                Export trades
              </p>

              <h3 className="mt-2 text-lg font-bold">
                CSV Export
              </h3>
            </button>

            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]"
            >
              <p className="text-sm text-gray-400">
                Cloud backup
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Synced
              </h3>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <ShieldAlert
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                Security
              </p>

              <h2 className="text-2xl font-bold">
                Account Protection
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                Authentication
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Protected
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Accesso protetto tramite credenziali.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                Session status
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Active
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Sessione attiva sul dispositivo corrente.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen
              size={22}
              className="text-green-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                Onboarding
              </p>

              <h2 className="text-2xl font-bold">
                Reopen Tutorial
              </h2>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Vuoi rivedere il tutorial iniziale?
            </p>

            <div className="mt-4">
              <ReopenOnboardingButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <LifeBuoy
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Support
                </p>

                <h2 className="text-2xl font-bold">
                  Help Center
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-gray-400">
                  Documentation
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  VOLTIS Docs
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-gray-400">
                  Community
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  Private Traders Hub
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/10 bg-red-500/[0.03] p-6">
            <p className="text-sm text-red-300">
              Danger zone
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Critical Actions
            </h2>

            <div className="mt-6 space-y-4">
              <button
                type="button"
                className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left transition hover:bg-red-500/20"
              >
                <p className="text-sm text-red-200">
                  Reset preferences
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Restore default settings
                </h3>
              </button>

              <button
                type="button"
                className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left transition hover:bg-red-500/20"
              >
                <p className="text-sm text-red-200">
                  Delete account
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Permanent removal
                </h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}