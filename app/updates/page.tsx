import {
  Megaphone,
  Wrench,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function UpdatesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const updates =
    await prisma.releaseNote.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400">
          What&apos;s New
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
          <Megaphone className="text-cyan-400" />
          App Updates
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
          Tutti gli aggiornamenti pubblicati, nuove feature,
          bug fix e comunicazioni importanti di VOLTIS.
        </p>
      </div>

      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm text-gray-400">
              Nessun aggiornamento pubblicato.
            </p>
          </div>
        ) : (
          updates.map((update) => {
            const Icon =
              update.type === "feature"
                ? Sparkles
                : update.type === "bugfix"
                ? Wrench
                : update.type === "maintenance"
                ? AlertTriangle
                : Megaphone;

            return (
              <div
                key={update.id}
                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <Icon className="text-cyan-400" />

                      <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                        {update.type}
                      </p>
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-white">
                      {update.title}
                    </h2>

                    <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-300">
                      {update.content}
                    </p>

                    <p className="mt-5 text-xs text-gray-500">
                      Published:{" "}
                      {new Date(
                        update.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                    {update.priority}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}