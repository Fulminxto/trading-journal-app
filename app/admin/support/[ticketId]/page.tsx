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
import {
  formatAdminDate,
  getAdminI18n,
  valueLabel,
} from "../../AdminI18n";

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

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (
    !currentUser ||
    (currentUser.role !== "FOUNDER" &&
      currentUser.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const { language, t } = getAdminI18n(
    currentUser.appLanguage
  );

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
              {t.supportTicket}
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              {t.ticketDetails}
            </h1>
          </div>

          <Link
            href="/admin/support"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-gray-300 transition hover:bg-white/[0.05]"
          >
            <ArrowLeft size={16} />
            {t.back}
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

                <p className="text-xs uppercase tracking-[0.15em] text-accent-bright">
                  {valueLabel(
                    t,
                    "ticketType",
                    ticket.type
                  )}
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
              {valueLabel(
                t,
                "ticketStatus",
                ticket.status
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                {t.user}
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {ticket.user.username}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                {t.ticketStatus}
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {valueLabel(
                  t,
                  "ticketStatus",
                  ticket.status
                )}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {t.ticketStatusDescription}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                {t.ticketPriority}
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {valueLabel(
                  t,
                  "priority",
                  ticket.priority
                )}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {t.ticketPriorityDescription}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                {t.created}
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                {formatAdminDate(
                  ticket.createdAt,
                  language
                )}
              </h3>
            </div>
          </div>

          {ticket.adminNote && (
            <div className="mt-8 rounded-[28px] border border-accent-bright/20 bg-accent-bright/10 p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-accent-bright">
                {t.adminResponse}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                {ticket.adminNote}
              </p>

              {ticket.resolvedAt && (
                <p className="mt-4 text-xs text-gray-500">
                  {t.resolvedAt}:{" "}
                  {formatAdminDate(
                    ticket.resolvedAt,
                    language
                  )}
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
          className="rounded-[36px] border border-accent-bright/20 bg-accent-bright/10 p-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
            {t.ticketManagement}
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {t.updateTicket}
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-gray-400">
                {t.ticketStatus}
              </label>

              <select
                name="status"
                defaultValue={ticket.status}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
              >
                <option value="open">
                  {valueLabel(
                    t,
                    "ticketStatus",
                    "open"
                  )}
                </option>
                <option value="in_review">
                  {valueLabel(
                    t,
                    "ticketStatus",
                    "in_review"
                  )}
                </option>
                <option value="resolved">
                  {valueLabel(
                    t,
                    "ticketStatus",
                    "resolved"
                  )}
                </option>
                <option value="closed">
                  {valueLabel(
                    t,
                    "ticketStatus",
                    "closed"
                  )}
                </option>
                <option value="rejected">
                  {valueLabel(
                    t,
                    "ticketStatus",
                    "rejected"
                  )}
                </option>
              </select>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {t.ticketStatusHelp}
              </p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-gray-400">
                {t.ticketPriority}
              </label>

              <select
                name="priority"
                defaultValue={ticket.priority}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
              >
                <option value="low">
                  {valueLabel(t, "priority", "low")}
                </option>
                <option value="normal">
                  {valueLabel(t, "priority", "normal")}
                </option>
                <option value="high">
                  {valueLabel(t, "priority", "high")}
                </option>
                <option value="critical">
                  {valueLabel(t, "priority", "critical")}
                </option>
              </select>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {t.ticketPriorityHelp}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs uppercase tracking-[0.15em] text-gray-400">
              {t.adminResponse}
            </label>

            <textarea
              name="adminNote"
              defaultValue={ticket.adminNote || ""}
              rows={6}
              placeholder={t.adminResponsePlaceholder}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              {t.adminResponseHelp}
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-accent px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-accent-bright"
          >
            {t.updateTicket}
          </button>
        </form>
      </div>
    </>
  );
}
