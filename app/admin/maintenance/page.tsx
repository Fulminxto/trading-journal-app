import {
  ShieldAlert,
  AlertTriangle,
  Wrench,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import GlobalToast from "@/components/GlobalToast";
import { updateMaintenanceMode } from "./actions";
import { getAdminI18n } from "../AdminI18n";

export default async function MaintenancePage({
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

  if (
    !user ||
    (user.role !== "FOUNDER" &&
      user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const { t } = getAdminI18n(user.appLanguage);

  const maintenance =
    await prisma.maintenanceMode.findFirst();

  return (
    <>
      <GlobalToast status={query.toast} />

      <div className="space-y-8">
        <div>
          <p className="text-sm text-gray-400">
            {t.systemMaintenance}
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
            <ShieldAlert className="text-accent-bright" />
            {t.maintenanceMode}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
            {t.maintenanceDescription}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[32px] border border-yellow-500/20 bg-yellow-500/10 p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-300" />

              <h2 className="text-xl font-black text-white">
                {t.warningMode}
              </h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {t.warningModeDescription}
            </p>
          </div>

          <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-red-300" />

              <h2 className="text-xl font-black text-white">
                {t.hardMaintenance}
              </h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {t.hardMaintenanceDescription}
            </p>
          </div>

          <div className="rounded-[32px] border border-accent-bright/20 bg-accent-bright/10 p-6">
            <div className="flex items-center gap-3">
              <Wrench className="text-accent-bright" />

              <h2 className="text-xl font-black text-white">
                {t.systemUpdates}
              </h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {t.systemUpdatesDescription}
            </p>
          </div>
        </div>

        <form
          action={updateMaintenanceMode}
          className="rounded-[36px] border border-accent-bright/20 bg-accent-bright/10 p-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
            {t.maintenanceConfiguration}
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {t.configureMaintenanceMode}
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
              <input
                type="checkbox"
                name="enabled"
                defaultChecked={
                  maintenance?.enabled
                }
                className="h-5 w-5 rounded border-white/20 bg-black"
              />

              {t.enableMaintenanceMode}
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
              <input
                type="checkbox"
                name="blockLogin"
                defaultChecked={
                  maintenance?.blockLogin
                }
                className="h-5 w-5 rounded border-white/20 bg-black"
              />

              {t.blockUserLogin}
            </label>

            <input
              name="title"
              defaultValue={
                maintenance?.title || ""
              }
              placeholder={t.maintenanceTitlePlaceholder}
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <select
              name="type"
              defaultValue={
                maintenance?.type ||
                "warning"
              }
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
            >
              <option value="info">
                {t.info}
              </option>

              <option value="warning">
                {t.warning}
              </option>

              <option value="critical">
                {t.critical}
              </option>
            </select>
          </div>

          <textarea
            name="message"
            rows={7}
            defaultValue={
              maintenance?.message || ""
            }
            placeholder={t.maintenanceMessagePlaceholder}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-accent px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-accent-bright"
          >
            {t.saveMaintenanceSettings}
          </button>
        </form>
      </div>
    </>
  );
}

