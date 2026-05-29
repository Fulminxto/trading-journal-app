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
    (user.role !== "OWNER" &&
      user.role !== "ADMIN")
  ) {
    redirect("/");
  }

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
            Admin Updates
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
            <Megaphone className="text-cyan-400" />
            Release Notes
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
            Pubblica aggiornamenti, bug fix, patch e comunicazioni
            importanti per gli utenti di VOLTIS.
          </p>
        </div>

        <form
          action={createReleaseNote}
          className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            New App Update
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Publish Release Note
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              name="title"
              required
              placeholder="Update title"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <select
              name="type"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
            >
              <option value="update">
                General Update
              </option>
              <option value="feature">
                New Feature
              </option>
              <option value="bugfix">
                Bug Fix
              </option>
              <option value="maintenance">
                Maintenance
              </option>
              <option value="notice">
                Important Notice
              </option>
            </select>

            <select
              name="priority"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
            >
              <option value="low">Low</option>
              <option value="normal">
                Normal
              </option>
              <option value="high">High</option>
              <option value="critical">
                Critical
              </option>
            </select>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
              <input
                type="checkbox"
                name="published"
                className="h-5 w-5 rounded border-white/20 bg-black"
              />

              Publish immediately
            </label>
          </div>

          <textarea
            name="content"
            required
            rows={7}
            placeholder="Describe what changed, what was fixed, or what users should know..."
            className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-cyan-400"
          >
            Create Update
          </button>
        </form>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              Update History
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Published & Draft Updates
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {updates.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                <p className="text-sm text-gray-400">
                  Nessun aggiornamento creato.
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
                            {update.type}
                          </p>
                        </div>

                        <h3 className="mt-3 text-xl font-black text-white">
                          {update.title}
                        </h3>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                          {update.content}
                        </p>

                        <p className="mt-4 text-xs text-gray-500">
                          Created:{" "}
                          {new Date(
                            update.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-2 text-right">
                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
                          {update.published
                            ? "Published"
                            : "Draft"}
                        </div>

                        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                          {update.priority}
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