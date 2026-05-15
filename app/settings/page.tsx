import {
  Settings,
  Palette,
  Bell,
  Download,
  ShieldAlert,
  LifeBuoy,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-left transition hover:bg-green-500/20">
              <p className="text-sm text-gray-400">
                Theme
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Dark Mode
              </h3>
            </button>

            <button className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]">
              <p className="text-sm text-gray-400">
                Accent Color
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Green
              </h3>
            </button>

            <button className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[0.04]">
              <p className="text-sm text-gray-400">
                Layout
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Professional
              </h3>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Bell
              size={22}
              className="text-yellow-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                Notifications
              </p>

              <h2 className="text-2xl font-bold">
                Sistema notifiche
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <p className="font-semibold">
                  Toast Notifications
                </p>

                <p className="text-sm text-gray-500">
                  Feedback azioni piattaforma
                </p>
              </div>

              <div className="rounded-xl bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                Active
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <p className="font-semibold">
                  Future Email Alerts
                </p>

                <p className="text-sm text-gray-500">
                  In arrivo
                </p>
              </div>

              <div className="rounded-xl bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-400">
                Soon
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Download
              size={22}
              className="text-blue-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                Backup
              </p>

              <h2 className="text-2xl font-bold">
                Export Data
              </h2>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              In futuro potrai esportare:
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 px-3 py-2 text-sm">
                CSV Export
              </div>

              <div className="rounded-xl bg-white/10 px-3 py-2 text-sm">
                PDF Reports
              </div>

              <div className="rounded-xl bg-white/10 px-3 py-2 text-sm">
                Full Backup
              </div>

              <div className="rounded-xl bg-white/10 px-3 py-2 text-sm">
                Account Analytics
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <LifeBuoy
              size={22}
              className="text-cyan-400"
            />

            <div>
              <p className="text-sm text-gray-400">
                Support
              </p>

              <h2 className="text-2xl font-bold">
                Assistenza
              </h2>
            </div>
          </div>

          <a
            href="mailto:yarikdziuban@gmail.com"
            className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 font-bold text-black transition hover:bg-green-400"
          >
            Contatta il supporto
          </a>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <ShieldAlert
              size={22}
              className="text-red-400"
            />

            <div>
              <p className="text-sm text-red-300/70">
                Danger Zone
              </p>

              <h2 className="text-2xl font-bold text-red-400">
                Area protetta
              </h2>
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              In futuro qui potrai:
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>
                • Disconnettere tutti i dispositivi
              </li>

              <li>
                • Eliminare il profilo
              </li>

              <li>
                • Scaricare backup completo
              </li>

              <li>
                • Archiviare account trading
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}