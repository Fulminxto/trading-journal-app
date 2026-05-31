import {
  User,
  BadgeCheck,
  Briefcase,
  Clock3,
  LineChart,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import { updateProfile } from "./actions";
import GlobalToast from "@/components/GlobalToast";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: Date | null) {
  if (!date) {
    return "Never";
  }

  return new Date(date).toLocaleString("it-IT");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isOnline(date?: Date | null) {
  if (!date) {
    return false;
  }

  return Date.now() - new Date(date).getTime() < 5 * 60 * 1000;
}

export default async function ProfilePage({
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

    include: {
      memberships: {
        include: {
          tradingAccount: {
            include: {
              trades: true,
              members: true,
            },
          },
        },
      },

      createdTrades: {
        orderBy: {
          openDate: "desc",
        },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const displayName = user.name || user.username;
  const initials = getInitials(displayName);

  const accounts = user.memberships.map(
    (membership) => membership.tradingAccount
  );

  const allTrades = accounts.flatMap(
    (account) => account.trades
  );

  const totalAccounts = accounts.length;
  const totalTrades = allTrades.length;

  const totalPnl = allTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const wins = allTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = allTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const breakEven = allTrades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const winRate =
    totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  const online = isOnline(user.lastActivityAt);

  const profileCompletionItems = [
    user.name,
    user.username,
    user.bio,
    user.workspaceName,
    user.tradingStyle,
    user.favoriteMarket,
    user.timezone,
    user.preferredSession,
    user.riskPerTrade,
    user.preferredBroker,
    user.setupStyle,
  ];

  const completedProfileItems =
    profileCompletionItems.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedProfileItems / profileCompletionItems.length) *
    100
  );

  const statCards = [
    {
      label: "Accounts",
      value: totalAccounts,
      tone: "text-white",
      icon: Wallet,
    },
    {
      label: "Trades",
      value: totalTrades,
      tone: "text-white",
      icon: LineChart,
    },
    {
      label: "Total PnL",
      value: formatCurrency(totalPnl),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
      icon: TrendingUp,
    },
    {
      label: "Win Rate",
      value: `${winRate.toFixed(2)}%`,
      tone:
        winRate >= 50
          ? "text-green-400"
          : "text-red-400",
      icon: Target,
    },
  ];

  return (
    <div>
      <GlobalToast status={query.toast} />

      <div className="mb-8">
        <p className="text-sm text-green-400">
          Profile Center
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <User className="text-green-400" />
          Trader Profile
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Gestisci identità, preferenze operative, stile di trading e informazioni personali usate da VOLTIS per personalizzare l’esperienza.
        </p>
      </div>

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border border-green-500/20 bg-green-500/10">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-3xl font-black text-green-400">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-black text-white">
                  {displayName}
                </h2>

                <span
                  className={`rounded-xl px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${online
                      ? "bg-green-500/10 text-green-400"
                      : "bg-white/10 text-gray-400"
                    }`}
                >
                  {online ? "Online" : "Offline"}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-400">
                @{user.username}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                  {user.role}
                </span>

                <span className="rounded-xl bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                  {profileCompletion}% Complete
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500">
                Last Login
              </p>

              <h3 className="mt-2 text-sm font-bold text-white">
                {formatDate(user.lastLoginAt)}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500">
                Last Activity
              </p>

              <h3 className="mt-2 text-sm font-bold text-white">
                {formatDate(user.lastActivityAt)}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500">
                Logins
              </p>

              <h3 className="mt-2 text-sm font-bold text-white">
                {user.loginCount}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                <Icon size={20} />
              </div>

              <p className="text-sm text-gray-400">
                {card.label}
              </p>

              <h2 className={`mt-2 text-2xl font-black ${card.tone}`}>
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <form
          action={updateProfile}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Personal Information
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Edit Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Display Name
              </p>

              <input
                name="name"
                defaultValue={user.name || ""}
                placeholder="Nome visualizzato"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Username
              </p>

              <input
                name="username"
                defaultValue={user.username}
                placeholder="Username"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                required
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Workspace Name
              </p>

              <input
                name="workspaceName"
                defaultValue={user.workspaceName || ""}
                placeholder="Nome workspace"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Timezone
              </p>

              <input
                name="timezone"
                defaultValue={user.timezone || ""}
                placeholder="Europe/Rome"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-sm text-gray-400">
                Bio
              </p>

              <textarea
                name="bio"
                defaultValue={user.bio || ""}
                placeholder="Descrivi brevemente il tuo profilo da trader..."
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-400">
              Trading Identity
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Trading Preferences
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Trading Style
              </p>

              <select
                name="tradingStyle"
                defaultValue={user.tradingStyle || ""}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="">
                  Seleziona stile
                </option>

                <option value="Scalping">
                  Scalping
                </option>

                <option value="Day Trading">
                  Day Trading
                </option>

                <option value="Swing Trading">
                  Swing Trading
                </option>

                <option value="Position Trading">
                  Position Trading
                </option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Favorite Market
              </p>

              <select
                name="favoriteMarket"
                defaultValue={user.favoriteMarket || ""}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="">
                  Seleziona mercato
                </option>

                <option value="Forex">
                  Forex
                </option>

                <option value="Gold">
                  Gold
                </option>

                <option value="Crypto">
                  Crypto
                </option>

                <option value="Indices">
                  Indices
                </option>

                <option value="Commodities">
                  Commodities
                </option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Preferred Session
              </p>

              <select
                name="preferredSession"
                defaultValue={user.preferredSession || ""}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              >
                <option value="">
                  Seleziona sessione
                </option>

                <option value="Asia">
                  Asia
                </option>

                <option value="London">
                  London
                </option>

                <option value="New York">
                  New York
                </option>

                <option value="Overlap">
                  Overlap
                </option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Risk Per Trade %
              </p>

              <input
                name="riskPerTrade"
                type="number"
                step="0.01"
                defaultValue={user.riskPerTrade ?? ""}
                placeholder="1"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Preferred Broker
              </p>

              <input
                name="preferredBroker"
                defaultValue={user.preferredBroker || ""}
                placeholder="Broker / Prop Firm"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Setup Style
              </p>

              <input
                name="setupStyle"
                defaultValue={user.setupStyle || ""}
                placeholder="Breakout, Pullback, SMC..."
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-green-500 px-6 py-4 font-bold text-black transition hover:bg-green-400"
          >
            Save Profile
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <BadgeCheck
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Completion
                </p>

                <h2 className="text-2xl font-bold">
                  Profile Score
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-400">
                Profile completed
              </p>

              <h3 className="mt-2 text-4xl font-black text-green-400">
                {profileCompletion}%
              </h3>

              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: `${profileCompletion}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Briefcase
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Workspace
                </p>

                <h2 className="text-2xl font-bold">
                  Account Access
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {user.memberships.length > 0 ? (
                user.memberships.map((membership) => (
                  <Link
                    key={membership.id}
                    href={`/accounts/${membership.tradingAccount.id}/dashboard`}
                    className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          {membership.tradingAccount.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {membership.tradingAccount.type} · {membership.role}
                        </p>
                      </div>

                      <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                        Open
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-400">
                  Nessun account collegato.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Clock3
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Activity
                </p>

                <h2 className="text-2xl font-bold">
                  Recent Trades
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {user.createdTrades.length > 0 ? (
                user.createdTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          {trade.symbol}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(trade.openDate).toLocaleDateString("it-IT")}
                        </p>
                      </div>

                      <span
                        className={`rounded-xl px-3 py-1 text-xs font-bold ${(trade.resultUsd || 0) >= 0
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                          }`}
                      >
                        {formatCurrency(trade.resultUsd || 0)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-400">
                  Nessun trade recente.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Shield
                size={22}
                className="text-green-400"
              />

              <div>
                <p className="text-sm text-gray-400">
                  Access
                </p>

                <h2 className="text-2xl font-bold">
                  Security Status
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-gray-400">
                  Authentication
                </p>

                <h3 className="mt-1 font-bold text-white">
                  Protected
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-gray-400">
                  Account Role
                </p>

                <h3 className="mt-1 font-bold text-white">
                  {user.role}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}