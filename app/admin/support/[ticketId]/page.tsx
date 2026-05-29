import {
  ArrowLeft,
  Bug,
  Lightbulb,
  LifeBuoy,
} from "lucide-react";

import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import GlobalToast from "@/components/GlobalToast";
import { updateSupportTicketStatus } from "./actions";

export default async function AdminTicketPage({
  params,
  searchParams,
}: {
  params: Promise<{
    ticketId: string;
  }>;

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

  const { ticketId } = await params;

  const ticketData =
    await prisma.supportTicket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        user: true,
      },
    });

  if (!ticketData) {
    redirect("/admin/support");
  }

  const ticket = ticketData;

  return (
    <>
      <GlobalToast status={query.toast} />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Support Ticket
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Ticket Details
            </h1>
          </div>

          <Link
            href="/admin/support"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-gray-300 transition hover:bg-white/[0.05]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                {ticket.type === "bug" ? (
                  <Bug className="text-red-400" />
                ) : ticket.type === "feature" ? (
                  <Lightbulb className="text-yellow-300" />
                ) : (
                  <LifeBuoy className="text-cyan-300" />
                )}

                <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                  {ticket.type}
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-black text-white">
                {ticket.subject}
              </h2>

              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-300">
                {ticket.message}
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
              {ticket.status}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                User
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {ticket.user.username}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                Ticket Status
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {ticket.status}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Indica lo stato attuale della richiesta.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                Ticket Priority
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {ticket.priority}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Indica quanto è urgente o importante il ticket.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                Created
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {new Date(
                  ticket.createdAt
                ).toLocaleDateString()}
              </h3>
            </div>
          </div>

          {ticket.adminNote && (
            <div className="mt-8 rounded-[28px] border border-cyan-500/20 bg-cyan-500/10 p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                Admin Response
              </p>

              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                {ticket.adminNote}
              </p>

              {ticket.resolvedAt && (
                <p className="mt-4 text-xs text-gray-500">
                  Resolved at:{" "}
                  {new Date(
                    ticket.resolvedAt
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        <form
          action={updateSupportTicketStatus.bind(
            null,
            ticket.id
          )}
          className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            Ticket Management
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Update Ticket
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-gray-400">
                Ticket Status
              </label>

              <select
                name="status"
                defaultValue={ticket.status}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
              >
                <option value="open">Open</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Usa questo campo per indicare se il ticket è aperto,
                in verifica, risolto, chiuso o respinto.
              </p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-gray-400">
                Ticket Priority
              </label>

              <select
                name="priority"
                defaultValue={ticket.priority}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Usa questo campo per definire la gravità o urgenza
                della richiesta.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Admin Response
            </label>

            <textarea
              name="adminNote"
              defaultValue={ticket.adminNote || ""}
              rows={6}
              placeholder="Scrivi cosa è stato fatto, cosa è stato risolto oppure perché la richiesta è stata respinta..."
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Questa risposta sarà visibile all’utente nella sua
              Ticket History.
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-cyan-400"
          >
            Update Ticket
          </button>
        </form>
      </div>
    </>
  );
}