import {
  Megaphone,
  Wrench,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import GlobalToast from "@/components/GlobalToast";
import { createReleaseNote } from "./actions";
import {
  formatAdminDate,
  getAdminI18n,
  valueLabel,
} from "../AdminI18n";

export default async function AdminUpdatesPage({
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

  const { language, t } = getAdminI18n(
    user.appLanguage
  );

  const updates =
    await prisma.releaseNote.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <>
      <GlobalToast status={query.toast} />

      <div className="space-y-8">
        <div>
          <p className="text-sm text-gray-400">
            {t.adminUpdates}
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
            <Megaphone className="text-cyan-400" />
            {t.releaseNotes}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
            {t.releaseNotesDescription}
          </p>
        </div>

        <form
          action={createReleaseNote}
          className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            {t.newAppUpdate}
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {t.publishReleaseNote}
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              name="title"
              required
              placeholder={t.updateTitle}
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <select
              name="type"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
            >
              <option value="update">
                {t.generalUpdate}
              </option>
              <option value="feature">
                {t.newFeature}
              </option>
              <option value="bugfix">
                {t.bugFix}
              </option>
              <option value="maintenance">
                {t.maintenance}
              </option>
              <option value="notice">
                {t.importantNotice}
              </option>
            </select>

            <select
              name="priority"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
            >
              <option value="low">{t.low}</option>
              <option value="normal">
                {t.normal}
              </option>
              <option value="high">{t.high}</option>
              <option value="critical">
                {t.critical}
              </option>
            </select>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
              <input
                type="checkbox"
                name="published"
                className="h-5 w-5 rounded border-white/20 bg-black"
              />

              {t.publishImmediately}
            </label>
          </div>

          <textarea
            name="content"
            required
            rows={7}
            placeholder={t.updateContentPlaceholder}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-cyan-400"
          >
            {t.createUpdate}
          </button>
        </form>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              {t.updateHistory}
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {t.publishedDraftUpdates}
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {updates.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                <p className="text-sm text-gray-400">
                  {t.noUpdatesCreated}
                </p>
              </div>
            ) : (
              updates.map((update) => {
                const Icon =
                  update.type === "feature"
                    ? Sparkles
                    : update.type === "bugfix"
                      ? Wrench
                      : update.type ===
                        "maintenance"
                        ? AlertTriangle
                        : Megaphone;

                return (
                  <div
                    key={update.id}
                    className="rounded-[28px] border border-white/10 bg-black/20 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <Icon className="text-cyan-400" />

                          <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                            {valueLabel(
                              t,
                              "updateType",
                              update.type
                            )}
                          </p>
                        </div>

                        <h3 className="mt-3 text-xl font-black text-white">
                          {update.title}
                        </h3>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                          {update.content}
                        </p>

                        <p className="mt-4 text-xs text-gray-500">
                          {t.created}:{" "}
                          {formatAdminDate(
                            update.createdAt,
                            language
                          )}
                        </p>
                      </div>

                      <div className="space-y-2 text-right">
                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
                          {update.published
                            ? t.published
                            : t.draft}
                        </div>

                        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                          {valueLabel(
                            t,
                            "priority",
                            update.priority
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

