import {
  Settings,
  Palette,
  Bell,
  Download,
  ShieldAlert,
  LifeBuoy,
  BookOpen,
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
      </div>

      <div className="space-y-6">
        <form
          action={updateSettings}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
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
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
              <p className="text-sm text-gray-400">
                Theme
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Dark Mode
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                Accent Color
              </p>

              <h3 className="mt-2 text-lg font-bold">
                VOLTIS Green
              </h3>
            </div>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    Compact Mode
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    Minimal layout
                  </h3>
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

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Default Currency
              </p>

              <select
                name="defaultCurrency"
                defaultValue={user.defaultCurrency}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="JPY">JPY — Japanese Yen</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>

            <label className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    Email Notifications
                  </p>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-gray-400">
                      Review Reminders
                    </p>

                    <label className="mt-4 flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="reviewReminders"
                        defaultChecked={user.reviewReminders}
                        className="h-5 w-5 rounded border-white/20 bg-black"
                      />

                      <span className="text-sm text-gray-400">
                        Enable reminders
                      </span>
                    </label>

                    <h3 className="mt-2 text-lg font-bold">
                      {user.reviewReminders
                        ? "Enabled"
                        : "Disabled"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Alert per review operative obbligatorie.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-gray-400">
                      Session Lock Alerts
                    </p>

                    <label className="mt-4 flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="sessionLockAlerts"
                        defaultChecked={user.sessionLockAlerts}
                        className="h-5 w-5 rounded border-white/20 bg-black"
                      />

                      <span className="text-sm text-gray-400">
                        Enable alerts
                      </span>
                    </label>

                    <h3 className="mt-2 text-lg font-bold">
                      {user.sessionLockAlerts
                        ? "Enabled"
                        : "Disabled"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Notifiche rischio operativo elevato.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-gray-400">
                      Daily Reminder
                    </p>

                    <label className="mt-4 flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="dailyTradingReminder"
                        defaultChecked={user.dailyTradingReminder}
                        className="h-5 w-5 rounded border-white/20 bg-black"
                      />

                      <span className="text-sm text-gray-400">
                        Enable daily reminder
                      </span>
                    </label>

                    <h3 className="mt-2 text-lg font-bold">
                      {user.dailyTradingReminder
                        ? "Enabled"
                        : "Disabled"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Reminder giornaliero compilazione trade.
                    </p>
                  </div>

                  <h3 className="mt-2 text-lg font-bold">
                    Performance alerts
                  </h3>
                </div>

                <input
                  type="checkbox"
                  name="emailNotifications"
                  defaultChecked={user.emailNotifications}
                  className="mt-1 h-5 w-5"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-green-500 px-6 py-4 font-bold text-black transition hover:bg-green-400"
          >
            Salva impostazioni
          </button>
        </form>

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
                Alerts & Activity
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                Trading alerts
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Enabled
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                Weekly reports
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Coming soon
              </h3>
            </div>
          </div>
        </div>

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
            <button className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]">
              <p className="text-sm text-gray-400">
                Export trades
              </p>

              <h3 className="mt-2 text-lg font-bold">
                CSV Export
              </h3>
            </button>

            <button className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]">
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
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                Session status
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Active
              </h3>
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
              <button className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left transition hover:bg-red-500/20">
                <p className="text-sm text-red-200">
                  Reset preferences
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Restore default settings
                </h3>
              </button>

              <button className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left transition hover:bg-red-500/20">
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