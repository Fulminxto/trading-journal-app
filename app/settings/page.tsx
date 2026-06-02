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
  Database,
  LockKeyhole,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import ReopenOnboardingButton from "@/components/ReopenOnboardingButton";
import GlobalToast from "@/components/GlobalToast";

import { updateSettings } from "./actions";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  tone?: string;
};

type SettingCardProps = {
  label: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  status?: string;
  statusTone?: string;
};

const inputClass =
  "mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-white outline-none transition focus:border-green-500/40";

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = "text-green-400",
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className={`rounded-2xl border border-white/10 bg-black/20 p-3 ${tone}`}>
        <Icon size={22} />
      </div>

      <div>
        <p className="text-sm text-gray-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function SettingCard({
  label,
  title,
  description,
  children,
  status,
  statusTone = "border-green-500/20 bg-green-500/10 text-green-300",
}: SettingCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {label}
          </p>

          <h3 className="mt-2 text-lg font-bold text-white">
            {title}
          </h3>
        </div>

        {status && (
          <span className={`rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${statusTone}`}>
            {status}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>

      {children}
    </div>
  );
}

function Toggle({
  name,
  defaultChecked,
}: {
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <input
      type="checkbox"
      name={name}
      defaultChecked={defaultChecked}
      className="mt-1 h-5 w-5 accent-green-500"
    />
  );
}

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

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  return (
    <div className="space-y-10">
      <GlobalToast status={query.toast} />

      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Settings center
              </span>

              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-300">
                Private access
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Impostazioni piattaforma
            </p>

            <h1 className="mt-3 flex items-center gap-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
              <Settings className="hidden text-green-400 sm:block" size={46} />
              Settings
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              Gestisci lingua, aspetto, notifiche, sicurezza,
              backup e preferenze operative. Questa pagina resta
              il centro di controllo personale dell’esperienza VOLTIS.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6 xl:col-span-2">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                <Sparkles size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  VOLTIS philosophy
                </p>

                <h2 className="mt-2 text-2xl font-black text-white">
                  Private Trading Operating System
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-400">
              VOLTIS è creato per trader selezionati che vogliono
              misurare, proteggere e migliorare il proprio comportamento
              operativo.
            </p>

            <p className="mt-4 text-sm font-bold leading-6 text-white">
              Se hai accesso a VOLTIS, sei dentro qualcosa di serio.
            </p>
          </div>
        </div>
      </section>

      <form
        action={updateSettings}
        className="space-y-8"
      >
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="Language"
            title="Lingua & Localizzazione"
            description="Configura lingua dell’app e valuta predefinita. La struttura è già pronta per il futuro sistema multilingua completo."
            icon={Globe}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SettingCard
              label="App Language"
              title="Lingua interfaccia"
              description="Scegli la lingua principale da usare nell’esperienza VOLTIS."
              status="Prepared"
              statusTone="border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
            >
              <select
                name="appLanguage"
                defaultValue={user.appLanguage ?? "it"}
                className={inputClass}
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
            </SettingCard>

            <SettingCard
              label="Default Currency"
              title="Valuta predefinita"
              description="Usata come preferenza generale quando vengono creati nuovi account o viste future."
            >
              <select
                name="defaultCurrency"
                defaultValue={user.defaultCurrency ?? "USD"}
                className={inputClass}
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
            </SettingCard>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="Appearance"
            title="Tema & UI"
            description="Preferenze visive personali. Alcune opzioni saranno collegate al rebranding finale dell’app."
            icon={Palette}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SettingCard
              label="Theme"
              title="Interface mode"
              description="Scegli la modalità visiva dell’app."
            >
              <select
                name="themePreference"
                defaultValue={user.themePreference ?? "dark"}
                className={inputClass}
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
            </SettingCard>

            <SettingCard
              label="Accent Color"
              title="Visual identity"
              description="Colore principale della piattaforma."
            >
              <select
                name="accentColor"
                defaultValue={user.accentColor ?? "green"}
                className={inputClass}
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
            </SettingCard>

            <SettingCard
              label="Compact Mode"
              title="Minimal layout"
              description="Riduce la densità visiva dell’interfaccia."
            >
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900 p-3">
                <span className="text-sm text-gray-400">
                  Enable compact mode
                </span>
                <Toggle
                  name="compactMode"
                  defaultChecked={Boolean(user.compactMode)}
                />
              </div>
            </SettingCard>

            <SettingCard
              label="Performance Blur"
              title="Hide balances"
              description="Nasconde valori sensibili durante l’utilizzo."
            >
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900 p-3">
                <span className="text-sm text-gray-400">
                  Enable privacy blur
                </span>
                <Toggle
                  name="performanceBlur"
                  defaultChecked={Boolean(user.performanceBlur)}
                />
              </div>
            </SettingCard>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="App Experience"
            title="Icona & Installazione"
            description="Preferenze PWA e dettagli di installazione. La parte finale verrà completata nel blocco dedicato alla PWA e al rebranding."
            icon={Smartphone}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SettingCard
              label="App Icon Variant"
              title="Home screen style"
              description="Scegli la variante dell’icona. La PWA userà questa preferenza nella fase finale."
              status="Planned"
              statusTone="border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
            >
              <select
                name="appIconVariant"
                defaultValue={user.appIconVariant ?? "classic"}
                className={inputClass}
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
            </SettingCard>

            <SettingCard
              label="PWA Status"
              title="Installazione app"
              description="Installazione come app su desktop, mobile e tablet verrà completata in un blocco dedicato."
              status="Queued"
              statusTone="border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="Notifications"
            title="In-app Alerts"
            description="Gestisci i promemoria operativi e gli alert principali dentro VOLTIS."
            icon={Bell}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SettingCard
              label="In-app Notifications"
              title="Notification Center"
              description="Le notifiche importanti arrivano direttamente dentro VOLTIS."
              status="Active"
            />

            <SettingCard
              label="Review Reminders"
              title={user.reviewReminders ? "Enabled" : "Disabled"}
              description="Alert per review operative obbligatorie."
            >
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900 p-3">
                <span className="text-sm text-gray-400">
                  Enable reminders
                </span>
                <Toggle
                  name="reviewReminders"
                  defaultChecked={Boolean(user.reviewReminders)}
                />
              </div>
            </SettingCard>

            <SettingCard
              label="Session Lock Alerts"
              title={user.sessionLockAlerts ? "Enabled" : "Disabled"}
              description="Notifiche rischio operativo elevato."
            >
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900 p-3">
                <span className="text-sm text-gray-400">
                  Enable lock alerts
                </span>
                <Toggle
                  name="sessionLockAlerts"
                  defaultChecked={Boolean(user.sessionLockAlerts)}
                />
              </div>
            </SettingCard>

            <SettingCard
              label="Daily Reminder"
              title={user.dailyTradingReminder ? "Enabled" : "Disabled"}
              description="Reminder giornaliero per compilazione trade e review."
            >
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900 p-3">
                <span className="text-sm text-gray-400">
                  Enable daily reminder
                </span>
                <Toggle
                  name="dailyTradingReminder"
                  defaultChecked={Boolean(user.dailyTradingReminder)}
                />
              </div>
            </SettingCard>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition hover:bg-green-400"
          >
            Salva impostazioni
          </button>
        </div>
      </form>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="Backup"
            title="Data Management"
            description="Backup, export e protezione dati. Il backup manuale Supabase è ora documentato e disponibile tramite script locale."
            icon={Download}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SettingCard
              label="Database backup"
              title="Manual script ready"
              description="Usa scripts/backup-supabase.ps1 per creare backup SQL locali prima di modifiche delicate."
              status="Ready"
            />

            <SettingCard
              label="Restore docs"
              title="Procedure documented"
              description="La procedura backup/restore è salvata in docs/BACKUP_AND_RESTORE.md."
              status="Docs"
              statusTone="border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="Security"
            title="Account Protection"
            description="Stato sicurezza dell’account e sessione corrente."
            icon={ShieldAlert}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SettingCard
              label="Authentication"
              title="Protected"
              description="Accesso protetto tramite credenziali e sessione NextAuth."
              status="Active"
            />

            <SettingCard
              label="Session status"
              title="Active"
              description="Sessione attiva sul dispositivo corrente."
              status="Online"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="Onboarding"
            title="Reopen Tutorial"
            description="Riapri l’onboarding iniziale. In futuro questa sezione diventerà parte del percorso premium di primo accesso."
            icon={BookOpen}
          />

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Vuoi rivedere il tutorial iniziale?
            </p>

            <div className="mt-4">
              <ReopenOnboardingButton />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <SectionHeader
            eyebrow="Support"
            title="Help Center"
            description="Documentazione, supporto interno e risorse private per chi usa VOLTIS."
            icon={LifeBuoy}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SettingCard
              label="Documentation"
              title="VOLTIS Docs"
              description="Area documentazione interna del progetto."
              status="Internal"
              statusTone="border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
            />

            <SettingCard
              label="Private Traders Hub"
              title="Access only"
              description="Spazio riservato agli utenti selezionati quando sarà pronto."
              status="Future"
              statusTone="border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-red-500/10 bg-red-500/[0.03] p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
            <AlertTriangle size={22} />
          </div>

          <div>
            <p className="text-sm text-red-300">
              Danger zone
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Critical Actions
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-red-100/70">
              Le azioni critiche restano bloccate finché non verrà costruito
              un flusso sicuro con conferme, permessi e backup obbligatorio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-left opacity-60"
          >
            <div className="flex items-center gap-3">
              <LockKeyhole size={18} className="text-red-300" />
              <p className="text-sm text-red-200">
                Reset preferences
              </p>
            </div>

            <h3 className="mt-2 text-lg font-bold text-white">
              Restore default settings
            </h3>
          </button>

          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-left opacity-60"
          >
            <div className="flex items-center gap-3">
              <LockKeyhole size={18} className="text-red-300" />
              <p className="text-sm text-red-200">
                Delete account
              </p>
            </div>

            <h3 className="mt-2 text-lg font-bold text-white">
              Permanent removal
            </h3>
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-green-500/20 bg-green-500/[0.04] p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-green-300">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p className="text-sm text-green-300">
              Settings status
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Settings Center prepared
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-400">
              La pagina è pronta come centro impostazioni. Alcune preferenze
              sono già salvate, altre sono preparate per i prossimi blocchi:
              multilingua completo, PWA, onboarding premium e rebranding finale.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
