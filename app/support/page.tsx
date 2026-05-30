import {
    LifeBuoy,
    Bug,
    MessageSquareWarning,
    Lightbulb,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { createSupportTicket } from "./actions";
import GlobalToast from "@/components/GlobalToast";

export default async function SupportPage({
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

    const tickets =
        await prisma.supportTicket.findMany({
            where: {
                userId: session.user.id,
            },

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
                        Support & Help Center
                    </p>

                    <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
                        <LifeBuoy className="text-cyan-400" />
                        Support Center
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                        Contatta il supporto VOLTIS per problemi,
                        richieste o feedback operativi.
                    </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 p-6">
                        <div className="flex items-center gap-3">
                            <Bug className="text-red-300" />

                            <h2 className="text-xl font-black text-white">
                                Report Bug
                            </h2>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                            Segnala problemi tecnici o comportamenti
                            anomali dell'applicazione.
                        </p>
                    </div>

                    <div className="rounded-[32px] border border-yellow-500/20 bg-yellow-500/10 p-6">
                        <div className="flex items-center gap-3">
                            <Lightbulb className="text-yellow-300" />

                            <h2 className="text-xl font-black text-white">
                                Request Feature
                            </h2>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                            Suggerisci nuove funzionalità o miglioramenti
                            per VOLTIS.
                        </p>
                    </div>

                    <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/10 p-6">
                        <div className="flex items-center gap-3">
                            <MessageSquareWarning className="text-cyan-300" />

                            <h2 className="text-xl font-black text-white">
                                Contact Support
                            </h2>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                            Contatta direttamente il supporto operativo.
                        </p>
                    </div>
                </div>

                <form
                    action={createSupportTicket}
                    className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8"
                >
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                        New Support Ticket
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-white">
                        Submit a Request
                    </h2>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <select
                            name="type"
                            className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
                        >
                            <option value="bug">Report Bug</option>
                            <option value="feature">Request Feature</option>
                            <option value="support">Contact Support</option>
                        </select>

                        <input
                            name="subject"
                            placeholder="Subject"
                            required
                            className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
                        />
                    </div>

                    <textarea
                        name="message"
                        placeholder="Describe the issue or request..."
                        required
                        rows={6}
                        className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
                    />

                    <button
                        type="submit"
                        className="mt-6 rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-cyan-400"
                    >
                        Submit Ticket
                    </button>
                </form>

                <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                                Support Tickets
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">
                                Ticket History
                            </h2>
                        </div>

                        <button className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20">
                            New Ticket
                        </button>
                    </div>

                    <div className="mt-8 space-y-4">
                        {tickets.length === 0 ? (
                            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                                <p className="text-sm text-gray-400">
                                    Nessun ticket presente.
                                </p>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="rounded-[28px] border border-white/10 bg-black/20 p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                                {ticket.type}
                                            </p>

                                            <h3 className="mt-2 text-xl font-black text-white">
                                                {ticket.subject}
                                            </h3>

                                            <p className="mt-4 text-sm leading-relaxed text-gray-300">
                                                {ticket.message}
                                            </p>
                                        </div>

                                        <div className="space-y-2 text-right">
                                            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
                                                {ticket.status}
                                            </div>

                                            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                                                {ticket.priority}
                                            </div>
                                        </div>
                                    </div>

                                    {ticket.adminNote && (
                                        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
                                            <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                                Admin Response
                                            </p>

                                            <p className="mt-3 text-sm leading-relaxed text-gray-300">
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
