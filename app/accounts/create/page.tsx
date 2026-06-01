import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { createAccount } from "../actions";

export default async function CreateAccountPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!currentUser) {
        redirect("/login");
    }

    const isGlobalAdmin =
        currentUser.role === "FOUNDER" ||
        currentUser.role === "ADMIN";

    const canCreatePersonalAccount =
        isGlobalAdmin ||
        currentUser.canCreatePersonalAccounts;

    const canCreateSharedAccount =
        isGlobalAdmin ||
        currentUser.canCreateSharedAccounts;

    if (
        !canCreatePersonalAccount &&
        !canCreateSharedAccount
    ) {
        redirect("/accounts");
    }

    return (
        <div>
            <div className="mb-10">
                <p className="text-sm text-gray-400">
                    Workspace
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    Create Trading Account
                </h1>

                <p className="mt-3 max-w-2xl text-sm text-gray-400">
                    Create a new personal or shared trading account inside VOLTIS.
                </p>
            </div>

            <form
                action={createAccount}
                className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2"
            >
                <input
                    name="name"
                    placeholder="Account name"
                    className="rounded-2xl bg-zinc-900 p-4"
                    required
                />

                <select
                    name="type"
                    defaultValue={
                        canCreatePersonalAccount ? "LIVE" : "SHARED"
                    }
                    aria-label="Account type"
                    className="rounded-2xl bg-zinc-900 p-4"
                    required
                >
                    {canCreatePersonalAccount && (
                        <>
                            <option value="LIVE">LIVE</option>
                            <option value="DEMO">DEMO</option>
                            <option value="PROP">PROP</option>
                            <option value="CHALLENGE">CHALLENGE</option>
                            <option value="FUNDED">FUNDED</option>
                        </>
                    )}

                    {canCreateSharedAccount && (
                        <option value="SHARED">SHARED</option>
                    )}
                </select>

                <input
                    name="initialBalance"
                    type="number"
                    placeholder="Initial balance"
                    className="rounded-2xl bg-zinc-900 p-4"
                    required
                />

                <input
                    name="currency"
                    defaultValue="USD"
                    placeholder="Currency"
                    className="rounded-2xl bg-zinc-900 p-4"
                    required
                />

                <input
                    name="broker"
                    placeholder="Broker / Prop Firm"
                    className="rounded-2xl bg-zinc-900 p-4"
                />

                <input
                    name="phase"
                    placeholder="Phase"
                    className="rounded-2xl bg-zinc-900 p-4"
                />

                <input
                    name="profitTarget"
                    type="number"
                    step="0.01"
                    placeholder="Profit Target %"
                    className="rounded-2xl bg-zinc-900 p-4"
                />

                <input
                    name="maxDrawdown"
                    type="number"
                    step="0.01"
                    placeholder="Max Drawdown %"
                    className="rounded-2xl bg-zinc-900 p-4"
                />

                <input
                    name="dailyDrawdown"
                    type="number"
                    step="0.01"
                    placeholder="Daily Drawdown %"
                    className="rounded-2xl bg-zinc-900 p-4"
                />

                <div className="flex gap-3 md:col-span-2">
                    <a
                        href="/accounts"
                        className="rounded-2xl bg-white/10 px-6 py-4 text-sm font-bold text-white hover:bg-white/20"
                    >
                        Cancel
                    </a>

                    <button
                        type="submit"
                        className="flex-1 rounded-2xl bg-green-500 px-6 py-4 text-sm font-bold text-black hover:bg-green-400"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
}
