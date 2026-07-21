import { redirect } from "next/navigation";

import CreateAccountForm from "@/app/accounts/create/CreateAccountForm";
import { auth } from "@/lib/auth";
import { isCorrectionMode } from "@/lib/correction-mode";
import { prisma } from "@/lib/prisma";

export default async function EditAccountInformationPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ correction?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { accountId } = await params;
  const query = await searchParams;
  const membership = await prisma.accountMember.findFirst({
    where: { userId: session.user.id, tradingAccountId: accountId },
    include: { tradingAccount: true },
  });
  if (!membership) redirect("/accounts");
  const canManage = membership.role === "MANAGER" || membership.canManageAccount;
  if (!canManage) redirect(`/accounts/${accountId}/dashboard`);
  const correctionMode =
    membership.tradingAccount.status === "ARCHIVED" &&
    isCorrectionMode(query.correction);
  if (membership.tradingAccount.status === "ARCHIVED" && !correctionMode) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const account = membership.tradingAccount;
  const value = (input: number | string | null) => input === null ? "" : String(input);
  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-muted">Account management</p>
        <h1 className="mt-2 text-4xl font-bold">Edit account information</h1>
        <p className="mt-3 text-sm text-muted">Update the source account parameters used throughout this workspace.</p>
      </div>
      <CreateAccountForm
        accountId={accountId}
        correctionMode={correctionMode}
        cancelHref={`/accounts/${accountId}/dashboard${correctionMode ? "?correction=1" : ""}`}
        canCreatePersonalAccount
        canCreateSharedAccount
        initialValues={{
          name: account.name,
          type: account.type,
          initialBalance: value(account.initialBalance),
          currency: account.currency,
          broker: value(account.broker),
          phase: value(account.phase),
          profitTarget: value(account.profitTarget),
          maxDrawdown: value(account.maxDrawdown),
          dailyDrawdown: value(account.dailyDrawdown),
        }}
        labels={{
          accountName: "Account name", accountType: "Account type",
          initialBalance: "Initial balance", currency: "Currency",
          broker: "Broker / Prop Firm", phase: "Phase",
          profitTarget: "Profit Target %", maxDrawdown: "Max Drawdown %",
          dailyDrawdown: "Daily Drawdown %", required: "Required",
          optional: "Optional", cancel: "Cancel", submit: "Save changes",
          pending: "Saving changes…",
        }}
      />
    </div>
  );
}
