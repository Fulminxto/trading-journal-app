import {
    LifeBuoy,
    Bug,
    Lightbulb,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function AdminSupportPage() {
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
        redirect("/");
    }

    const tickets =
        await prisma.supportTicket.findMany({
            include: {
                user: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm text-gray-400">
                    Admin Support Dashboard
                </p>

                <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
                    <LifeBuoy className="text-cyan-400" />
                    Support Management
                </h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 p-6">
                    <p className="text-sm text-red-200">
                        Bug Reports
                    </p>

                    <h2 className="mt-3 text-4xl font-black text-white">
                        {
                            tickets.filter(
                                (ticket) =>
                                    ticket.type === "bug"
                            ).length
                        }
                    </h2>
                </div>

                <div className="rounded-[32px] border border-yellow-500/20 bg-yellow-500/10 p-6">
                    <p className="text-sm text-yellow-200">
                        Feature Requests
                    </p>

                    <h2 className="mt-3 text-4xl font-black text-white">
                        {
                            tickets.filter(
                                (ticket) =>
                                    ticket.type ===
                                    "feature"
                            ).length
                        }
                    </h2>
                </div>

                <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/10 p-6">
                    <p className="text-sm text-cyan-200">
                        Open Tickets
                    </p>

                    <h2 className="mt-3 text-4xl font-black text-white">
                        {
                            tickets.filter(
                                (ticket) =>
                                    ticket.status ===
                                    "open"
                            ).length
                        }
                    </h2>
                </div>
            </div>

            <div className="space-y-4">
                {tickets.length === 0 ? (
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
                        <p className="text-sm text-gray-400">
                            Nessun ticket presente.
                        </p>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <Link
                            key={ticket.id}
                            href={`/admin/support/${ticket.id}`}
                            className="block rounded-[32px] border border-white/10 bg-white/[0.03] p-8 transition hover:border-cyan-500/30 hover:bg-cyan-500/[0.03]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        {ticket.type ===
                                            "bug" ? (
                                            <Bug className="text-red-400" />
                                        ) : (
                                            <Lightbulb className="text-yellow-300" />
                                        )}

                                        <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                            {ticket.type}
                                        </p>
                                    </div>

                                    <h2 className="mt-4 text-2xl font-black text-white">
                                        {ticket.subject}
                                    </h2>

                                    <p className="mt-4 text-sm leading-relaxed text-gray-300">
                                        {ticket.message}
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
                                        <span>
                                            User:{" "}
                                            {
                                                ticket.user
                                                    .username
                                            }
                                        </span>

                                        <span>
                                            Status:{" "}
                                            {ticket.status}
                                        </span>

                                        <span>
                                            Priority:{" "}
                                            {
                                                ticket.priority
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
                                    {ticket.status}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}